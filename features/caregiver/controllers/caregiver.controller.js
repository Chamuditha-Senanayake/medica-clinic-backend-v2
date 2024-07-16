import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import { sendEmailFromCustomAccount } from '../../../utils/sendMail.js';
import sql from 'mssql';
import {
  EntityId,
  StringValue,
  SignedInteger,
} from '../../../utils/type-def.js';
import jwt from 'jsonwebtoken';
import jwtSign from '../../../utils/jwtSign.js';

const CaregiverController = {
  /**
   *
   * Request caregiver by patient
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async requestCaregiver(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Caregiver.VALIDATION_ERROR,
        data: errors,
      });
    }

    let connection = request.app.locals.db;
    const { Id = 0, CaregiverEmail, CaregiverName, Status } = request.body;

    let token;

    try {
      let params1 = [
        EntityId({ fieldName: 'Id', value: Id }),
        { name: 'PatientUserId', type: sql.Int, value: request.user.userId },
        { name: 'CaregiverEmail', type: sql.NVarChar, value: CaregiverEmail },
        { name: 'Status', type: sql.NVarChar, value: Status },
      ];

      let caregiverAssignResult = await executeSp({
        spName: `PatientCaregiverAssign`,
        params: params1,
        connection,
      });

      caregiverAssignResult = caregiverAssignResult.recordsets[0][0];

      token = jwtSign(
        {
          Id: caregiverAssignResult.Id,
          patientId: request.user.userId,
          caregiverEmail: CaregiverEmail,
        },
        process.env.CAREGIVER_REQUEST_TOKEN_EXPIRATION_TIME
      );

      handleResponse(
        response,
        200,
        'success',
        'Caregiver assigned successfully',
        caregiverAssignResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    } finally {
      if (Status === 'invited') {
        try {
          let params2 = [
            StringValue({ fieldName: 'Email', value: CaregiverEmail }),
          ];

          let caregiverInfo = await executeSp({
            spName: `UserGetByEmail`,
            params: params2,
            connection,
          });

          if (!caregiverInfo) {
            throw Error('User not found');
          }

          sendEmailFromCustomAccount({
            to: CaregiverEmail,
            subject: 'You have assigned as a caregiver',
            html: `<p>Hello ${CaregiverName},</p><h2>Verify Your Email</h2><p>Click the link below to proceed:</p><a href='${process.env.FRONTEND_URL}/invitation/caregiver?token=${token}'>${process.env.FRONTEND_URL}/invitation/caregiver?token=${token}`,
          });
        } catch (error) {
          let errorCode = error.message.split(' ')[0];

          if (errorCode === '29101' || errorCode === '29202') {
            sendEmailFromCustomAccount({
              to: CaregiverEmail,
              subject: 'You have assigned as a caregiver',
              html: `<p>Hello ${CaregiverName},</p><h2>Verify Your Email</h2><p>Step 1 - Signup </p><a href='${process.env.FRONTEND_URL}/signup'> ${process.env.FRONTEND_URL}/invitation/caregiver?token=${token}</a> 
              <p>Step 2 - Accept invitation </p><a href='${process.env.FRONTEND_URL}/invitation/caregiver?token=${token}'> ${process.env.FRONTEND_URL}/invitation/caregiver?token=${token}</a>`,
            });
          } else {
            handleError(
              response,
              500,
              'error',
              error.message,
              'Something went wrong'
            );
            next(error);
          }
        }
      }
    }
  },

  /**
   *
   * Response by caregiver
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async respondCaregiver(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Caregiver.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Token, Status } = request.body;

      let decodedToken = jwt.verify(Token, process.env.JWT_SECRET);

      let params1 = [
        StringValue({ fieldName: 'Email', value: decodedToken.caregiverEmail }),
      ];

      let caregiverInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params1,
        connection,
      });

      let params2 = [
        EntityId({ fieldName: 'Id', value: decodedToken.Id }),
        EntityId({
          fieldName: 'CaregiverUserId',
          value: caregiverInfo.recordsets[0][0].Id,
        }),
        StringValue({ fieldName: 'Status', value: Status }),
      ];

      let caregiverAssignResult = await executeSp({
        spName: `PatientCaregiverAssign`,
        params: params2,
        connection,
      });

      caregiverAssignResult = caregiverAssignResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        caregiverAssignResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  /**
   *
   * Caregiver token validation
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async tokenValidation(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Caregiver.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Token } = request.body;

      let decodedToken = jwt.verify(Token, process.env.JWT_SECRET);

      let params1 = [
        EntityId({ fieldName: 'Id', value: decodedToken.patientId }),
      ];

      let patientInfo = await executeSp({
        spName: `UserGetById`,
        params: params1,
        connection,
      });

      let params2 = [
        StringValue({ fieldName: 'Email', value: decodedToken.caregiverEmail }),
      ];

      let caregiverInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params2,
        connection,
      });

      let params3 = [EntityId({ fieldName: 'Id', value: decodedToken.Id })];

      let PatientCaregiverInfo = await executeSp({
        spName: `PatientCaregiverGet`,
        params: params3,
        connection,
      });

      PatientCaregiverInfo = PatientCaregiverInfo.recordsets[0][0];
      PatientCaregiverInfo.patientInfo = patientInfo.recordsets[0][0];
      PatientCaregiverInfo.IsRegisteredCaregiver = caregiverInfo ? true : false;

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        PatientCaregiverInfo
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  /**
   *
   * Create caregiver token
   *
   * @param {request} request object
   * @param {response} response object
   * @returns
   */
  async issueCaregiverPatientToken(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Caregiver.VALIDATION_ERROR,
        data: errors,
      });
    }

    let token = jwtSign({
      PatientId: request.body.PatientId,
    });

    handleResponse(response, 200, 'success', 'Data retrived successfully', {
      token,
    });
  },

  /**
   *
   * Get caregiver patients
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getCaregiverPatients(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Caregiver.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;

      const { SearchBy, Page = 0, Limit = 0 } = request.body;

      var params = [
        { name: 'SearchBy', type: sql.NVarChar, value: SearchBy },
        EntityId({ fieldName: 'CaregiverUserId', value: request.user.userId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let caregiverPatientsGetResult = await executeSp({
        spName: `CaregiverPatientsGet`,
        params: params,
        connection,
      });

      //Append caregiver patients and count for pagination
      caregiverPatientsGetResult = [
        caregiverPatientsGetResult.recordsets[0],
        caregiverPatientsGetResult.recordsets[1][0],
      ];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        caregiverPatientsGetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  // /**
  //  *
  //  * get nurse by [Id, NurseUserId, UserId]
  //  *
  //  * @param {request} request object
  //  * @param {response} response object
  //  * @param {next} next - middleware
  //  * @returns
  //  */
  // async getNurse(request, response, next) {
  //   const errors = validationResult(request);
  //   if (!errors.isEmpty()) {
  //     return response.status(422).json({
  //       error: true,
  //       message: ResponseMessage.Nurse.VALIDATION_ERROR,
  //       data: errors,
  //     });
  //   }

  //   try {
  //     let connection = request.app.locals.db;
  //     const { Id, NurseUserId, UserId } = request.body;

  //     var params = [
  //       EntityId({ fieldName: "Id", value: Id }),
  //       EntityId({ fieldName: "NurseUserId", value: NurseUserId }),
  //       EntityId({ fieldName: "UserId", value: UserId }),
  //     ];

  //     let nurseGetResult = await executeSp({
  //       spName: `NurseGet`,
  //       params: params,
  //       connection,
  //     });

  //     nurseGetResult = nurseGetResult.recordsets[0];

  //     handleResponse(
  //       response,
  //       200,
  //       "success",
  //       "Nurse data retrived successfully",
  //       nurseGetResult
  //     );
  //   } catch (error) {
  //     handleError(
  //       response,
  //       500,
  //       "error",
  //       error.message,
  //       "Something went wrong"
  //     );
  //     next(error);
  //   }
  // },

  // /**
  //  *
  //  * save a nurse
  //  *
  //  * @param {request} request object
  //  * @param {response} response object
  //  * @param {next} next function
  //  * @returns
  //  */
  // async saveNurse(request, response, next) {
  //   const errors = validationResult(request);
  //   if (!errors.isEmpty()) {
  //     return response.status(422).json({
  //       error: true,
  //       message: ResponseMessage.Nurse.VALIDATION_ERROR,
  //       data: errors,
  //     });
  //   }

  //   try {
  //     let connection = request.app.locals.db;
  //     const {
  //       Id,
  //       FirstName,
  //       MiddleName,
  //       LastName,
  //       Email,
  //       NIC,
  //       Title,
  //       Status,
  //       UserSaved,
  //     } = request.body;

  //      var params = [
  //     EntityId({ fieldName: "Id", value: Id }),
  //     StringValue({ fieldName: "FirstName", value: FirstName }),
  //     StringValue({ fieldName: "MiddleName", value: MiddleName }),
  //     StringValue({ fieldName: "LastName", value: LastName }),
  //     StringValue({ fieldName: "Email", value: Email }),
  //     StringValue({ fieldName: "NIC", value: NIC }),
  //     StringValue({ fieldName: "Title", value: Title }),
  //     SignedInteger({
  //       fieldName: "Status",
  //       value: Status,
  //     }),
  //     EntityId({ fieldName: "UserSaved", value: UserSaved }),
  //   ];

  //     let nurseSaveResult = await executeSp({
  //       spName: `NurseSave`,
  //       params: params,
  //       connection,
  //     });

  //     console.log(nurseSaveResult.recordsets);
  //     nurseSaveResult = nurseSaveResult.recordsets[0][0];

  //     handleResponse(
  //       response,
  //       200,
  //       "success",
  //       "Nurse data retrieved successfully",
  //       nurseSaveResult
  //     );
  //   } catch (error) {
  //     handleError(
  //       response,
  //       500,
  //       "error",
  //       error.message,
  //       "Something went wrong"
  //     );
  //     next(error);
  //   }
  // },

  // async SaveNurseBranch(request, response, next) {
  //   const errors = validationResult(request);
  //   if (!errors.isEmpty()) {
  //     return response.status(422).json({
  //       error: true,
  //       message: ResponseMessage.Nurse.VALIDATION_ERROR,
  //       data: errors,
  //     });
  //   }

  //   try {
  //     let connection = request.app.locals.db;
  //     const {
  //       Id,
  //       InstituteBranchId,
  //       NurseId,
  //       Status,
  //       UserSaved,
  //     } = request.body;

  //      var params = [
  //     EntityId({ fieldName: "Id", value: Id }),
  //     StringValue({ fieldName: "InstituteBranchId", value: InstituteBranchId }),
  //     StringValue({ fieldName: "NurseId", value: NurseId }),
  //     SignedInteger({
  //       fieldName: "Status",
  //       value: Status,
  //     }),
  //     EntityId({ fieldName: "UserSaved", value: UserSaved }),
  //   ];

  //     let nurseBranchSaveResult = await executeSp({
  //       spName: `NurseBranchSave`,
  //       params: params,
  //       connection,
  //     });

  //     console.log(nurseBranchSaveResult.recordsets);
  //     nurseBranchSaveResult = nurseBranchSaveResult.recordsets[0][0];

  //     handleResponse(
  //       response,
  //       200,
  //       "success",
  //       "Data retrieved successfully",
  //       nurseBranchSaveResult
  //     );
  //   } catch (error) {
  //     handleError(
  //       response,
  //       500,
  //       "error",
  //       error.message,
  //       "Something went wrong"
  //     );
  //     next(error);
  //   }
  // },

  // async SaveDoctorNurse(request, response, next) {
  //   const errors = validationResult(request);
  //   if (!errors.isEmpty()) {
  //     return response.status(422).json({
  //       error: true,
  //       message: ResponseMessage.Nurse.VALIDATION_ERROR,
  //       data: errors,
  //     });
  //   }

  //   try {
  //     let connection = request.app.locals.db;
  //     const {
  //       Id,
  //       DoctorId,
  //       NurseId,
  //       Status,
  //       UserSaved,
  //     } = request.body;

  //     var params = [
  //       EntityId({ fieldName: "Id", value: Id }),
  //       EntityId({ fieldName: "DoctorId", value: DoctorId }),
  //       EntityId({ fieldName: "NurseId", value: NurseId }),
  //       SignedInteger({
  //         fieldName: "Status",
  //         value: Status,
  //       }),
  //       EntityId({ fieldName: "UserSaved", value: UserSaved }),
  //     ];

  //     let doctorNurseSaveResult = await executeSp({
  //       spName: `DoctorNurseSave`,
  //       params: params,
  //       connection,
  //     });

  //     console.log(doctorNurseSaveResult.recordsets);
  //     doctorNurseSaveResult = doctorNurseSaveResult.recordsets;

  //     handleResponse(
  //       response,
  //       200,
  //       "success",
  //       "Data retrieved successfully",
  //       doctorNurseSaveResult
  //     );
  //   } catch (error) {
  //     handleError(
  //       response,
  //       500,
  //       "error",
  //       error.message,
  //       "Something went wrong"
  //     );
  //     next(error);
  //   }
  // },
};

export default CaregiverController;
