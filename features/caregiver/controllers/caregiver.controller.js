import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
} from "../../../utils/type-def.js";

const CaregiverController = {


  /**
   *
   * Assign caregiver
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async assignCaregiver(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Nurse.VALIDATION_ERROR,
        data: errors,
      });
    }

    //TODO: PatientCaregiver table - PatientUserId, CaregiverUserId, CaregiverEmail, status(active, disable,..)

    try {
      let connection = request.app.locals.db;
      const { 
        CaregiverName, 
        CaregiverEmail,
        Relationship, 
      } = request.body;

      let params1 = [ StringValue({ fieldName: "Email", value: CaregiverEmail }) ];

      let caregiverInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params1,
        connection,
      });

      if(caregiverInfo){

        let params2 = [ StringValue({ fieldName: "Id", value: request.user.userId }) ];

        let patientInfo = await executeSp({
          spName: `UserGetById`,
          params: params2,
          connection,
        });

        sendEmailFromCustomAccount({
        to: Email,  
        subject:"You have assigned as a caregiver",
        html:`<h2>Verify Your Email</h2><p>Click the link below to proceed:</p><a href='${process.env.FRONTEND_URL}/login?caregiver_token=${token}'>${process.env.FRONTEND_URL}/login?token=${token}</a>`
      })
      }

      

      let params2 = [
        StringValue({ fieldName: "CaregiverName", value: CaregiverName }),
        StringValue({ fieldName: "Email", value: CaregiverEmail }),
        StringValue({ fieldName: "Relationship", value: Relationship }),

      ];

      console.log(userGetByEmailResult.recordsets[0][0].Email,)

      let caregiverAssignResult = await executeSp({
        spName: `CaregiverAssign`,
        params: params2,
        connection,
      });

      caregiverAssignResult = caregiverAssignResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        caregiverAssignResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
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
