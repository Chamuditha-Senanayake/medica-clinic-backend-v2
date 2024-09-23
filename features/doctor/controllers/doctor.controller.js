import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import jwtSign from '../../../utils/jwtSign.js';
import { sendEmailFromCustomAccount } from '../../../utils/sendMail.js';
import { EntityId, StringValue } from '../../../utils/type-def.js';

const DoctorController = {
  /**
   *
   * Request doctor by patient
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async requestDoctor(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    let connection = request.app.locals.db;
    const { Id = 0, DoctorEmail, DoctorName, Status } = request.body;

    let token;

    try {
      let params1 = [
        EntityId({ fieldName: 'Id', value: Id }),
        { name: 'PatientUserId', type: sql.Int, value: request.user.userId },
        { name: 'DoctorEmail', type: sql.NVarChar, value: DoctorEmail },
        { name: 'Status', type: sql.NVarChar, value: Status },
      ];

      let doctorAssignResult = await executeSp({
        spName: `PatientDoctorAssign`,
        params: params1,
        connection,
      });

      doctorAssignResult = doctorAssignResult.recordsets[0][0];

      token = jwtSign(
        {
          Id: doctorAssignResult.Id,
          patientId: request.user.userId,
          doctorEmail: DoctorEmail,
        },
        process.env.DOCTOR_REQUEST_TOKEN_EXPIRATION_TIME
      );

      handleResponse(
        response,
        200,
        'success',
        'Doctor assigned successfully',
        doctorAssignResult
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
            StringValue({ fieldName: 'Email', value: DoctorEmail }),
          ];

          let doctorInfo = await executeSp({
            spName: `UserGetByEmail`,
            params: params2,
            connection,
          });

          if (!doctorInfo) {
            throw Error('User not found');
          }

          sendEmailFromCustomAccount({
            to: DoctorEmail,
            subject: 'You have assigned as a doctor',
            html: `<p>Hello ${DoctorName},</p><h2>Verify Your Email</h2><p>Click the link below to proceed:</p><a href='${process.env.FRONTEND_URL}/invitation/doctor?token=${token}' target='_blank'>${process.env.FRONTEND_URL}/invitation/doctor?token=${token}`,
          });
        } catch (error) {
          let errorCode = error.message.split(' ')[0];

          if (errorCode === '29101' || errorCode === '29202') {
            sendEmailFromCustomAccount({
              to: DoctorEmail,
              subject: 'You have assigned as a doctor',
              html: `<p>Hello ${DoctorName},</p><h2>Verify Your Email</h2><p>Step 1 - Signup </p><a href='${process.env.FRONTEND_URL}/signup' target='_blank'> here</a> 
              <p>Step 2 - Accept invitation </p><a href='${process.env.FRONTEND_URL}/invitation/doctor?token=${token}' target='_blank'> ${process.env.FRONTEND_URL}/invitation/doctor?token=${token}</a>`,
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
   * Response by doctor
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async respondDoctor(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Token, Status } = request.body;

      let decodedToken = jwt.verify(Token, process.env.JWT_SECRET);

      let params1 = [
        StringValue({ fieldName: 'Email', value: decodedToken.doctorEmail }),
      ];

      let doctorInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params1,
        connection,
      });

      let params2 = [
        EntityId({ fieldName: 'Id', value: decodedToken.Id }),
        EntityId({
          fieldName: 'DoctorUserId',
          value: doctorInfo.recordsets[0][0].Id,
        }),
        StringValue({ fieldName: 'Status', value: Status }),
      ];

      let doctorAssignResult = await executeSp({
        spName: `PatientDoctorAssign`,
        params: params2,
        connection,
      });

      doctorAssignResult = doctorAssignResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        doctorAssignResult
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
   * Doctor token validation
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        StringValue({ fieldName: 'Email', value: decodedToken.doctorEmail }),
      ];

      let doctorInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params2,
        connection,
      });

      let params3 = [EntityId({ fieldName: 'Id', value: decodedToken.Id })];

      let patientDoctorInfo = await executeSp({
        spName: `PatientDoctorGet`,
        params: params3,
        connection,
      });

      patientDoctorInfo = patientDoctorInfo.recordsets[0][0];
      patientDoctorInfo.doctorInfo = patientInfo.recordsets[0][0];
      patientDoctorInfo.IsRegisteredDoctor = doctorInfo ? true : false;

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        patientDoctorInfo
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
   * Create doctor token
   *
   * @param {request} request object
   * @param {response} response object
   * @returns
   */
  async issueDoctorPatientToken(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
   * Get doctor patients
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDoctorPatients(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;

      const { SearchBy = '', Page = 0, Limit = 0 } = request.body;

      var params = [
        { name: 'SearchBy', type: sql.NVarChar, value: SearchBy },
        EntityId({ fieldName: 'DoctorUserId', value: request.user.userId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let doctorPatientsGetResult = await executeSp({
        spName: `DoctorPatientsGet`,
        params: params,
        connection,
      });

      //Append doctor patients and count for pagination

      doctorPatientsGetResult = [
        doctorPatientsGetResult.recordsets[0],
        doctorPatientsGetResult.recordsets[1][0],
      ];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        doctorPatientsGetResult
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
};

export default DoctorController;
