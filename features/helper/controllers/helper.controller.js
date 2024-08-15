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

const HelperController = {
  /**
   *
   * Request helper by patient
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async requestHelper(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Helper.VALIDATION_ERROR,
        data: errors,
      });
    }

    let connection = request.app.locals.db;
    const { Id = 0, HelperEmail, HelperName, Status } = request.body;

    let token;

    try {
      let params1 = [
        EntityId({ fieldName: 'Id', value: Id }),
        { name: 'PatientUserId', type: sql.Int, value: request.user.userId },
        { name: 'HelperEmail', type: sql.NVarChar, value: HelperEmail },
        { name: 'Status', type: sql.NVarChar, value: Status },
      ];

      let helperAssignResult = await executeSp({
        spName: `PatientHelperAssign`,
        params: params1,
        connection,
      });

      helperAssignResult = helperAssignResult.recordsets[0][0];

      token = jwtSign(
        {
          Id: helperAssignResult.Id,
          patientId: request.user.userId,
          helperEmail: HelperEmail,
        },
        process.env.HELPER_REQUEST_TOKEN_EXPIRATION_TIME
      );

      handleResponse(
        response,
        200,
        'success',
        'Helper assigned successfully',
        helperAssignResult
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
            StringValue({ fieldName: 'Email', value: HelperEmail }),
          ];

          let helperInfo = await executeSp({
            spName: `UserGetByEmail`,
            params: params2,
            connection,
          });

          if (!helperInfo) {
            throw Error('User not found');
          }

          sendEmailFromCustomAccount({
            to: HelperEmail,
            subject: 'You have assigned as a helper',
            html: `<p>Hello ${HelperName},</p><h2>Verify Your Email</h2><p>Click the link below to proceed:</p><a href='${process.env.FRONTEND_URL}/invitation/helper?token=${token}' target='_blank'>${process.env.FRONTEND_URL}/invitation/helper?token=${token}`,
          });
        } catch (error) {
          let errorCode = error.message.split(' ')[0];

          if (errorCode === '29101' || errorCode === '29202') {
            sendEmailFromCustomAccount({
              to: HelperEmail,
              subject: 'You have assigned as a helper',
              html: `<p>Hello ${HelperName},</p><h2>Verify Your Email</h2><p>Step 1 - Signup </p><a href='${process.env.FRONTEND_URL}/signup' target='_blank'> here</a> 
              <p>Step 2 - Accept invitation </p><a href='${process.env.FRONTEND_URL}/invitation/helper?token=${token}' target='_blank'> ${process.env.FRONTEND_URL}/invitation/helper?token=${token}</a>`,
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
   * Response by helper
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async respondHelper(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Helper.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Token, Status } = request.body;

      let decodedToken = jwt.verify(Token, process.env.JWT_SECRET);

      let params1 = [
        StringValue({ fieldName: 'Email', value: decodedToken.helperEmail }),
      ];

      let helperInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params1,
        connection,
      });

      let params2 = [
        EntityId({ fieldName: 'Id', value: decodedToken.Id }),
        EntityId({
          fieldName: 'HelperUserId',
          value: helperInfo.recordsets[0][0].Id,
        }),
        StringValue({ fieldName: 'Status', value: Status }),
      ];

      let helperAssignResult = await executeSp({
        spName: `PatientHelperAssign`,
        params: params2,
        connection,
      });

      helperAssignResult = helperAssignResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        helperAssignResult
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
   * Helper token validation
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
        message: ResponseMessage.Helper.VALIDATION_ERROR,
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
        StringValue({ fieldName: 'Email', value: decodedToken.helperEmail }),
      ];

      let helperInfo = await executeSp({
        spName: `UserGetByEmail`,
        params: params2,
        connection,
      });

      let params3 = [EntityId({ fieldName: 'Id', value: decodedToken.Id })];

      let patientHelperInfo = await executeSp({
        spName: `PatientHelperGet`,
        params: params3,
        connection,
      });

      patientHelperInfo = patientHelperInfo.recordsets[0][0];
      patientHelperInfo.helperInfo = patientInfo.recordsets[0][0];
      patientHelperInfo.IsRegisteredHelper = helperInfo ? true : false;

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        patientHelperInfo
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
   * Create helper token
   *
   * @param {request} request object
   * @param {response} response object
   * @returns
   */
  async issueHelperPatientToken(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Helper.VALIDATION_ERROR,
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
   * Get helper patients
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getHelperPatients(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Helper.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;

      const { SearchBy, Page = 0, Limit = 0 } = request.body;

      var params = [
        { name: 'SearchBy', type: sql.NVarChar, value: SearchBy },
        EntityId({ fieldName: 'HelperUserId', value: request.user.userId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let helperPatientsGetResult = await executeSp({
        spName: `HelperPatientsGet`,
        params: params,
        connection,
      });

      //Append helper patients and count for pagination

      helperPatientsGetResult = [
        helperPatientsGetResult.recordsets[0],
        helperPatientsGetResult.recordsets[1][0],
      ];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        helperPatientsGetResult
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

export default HelperController;
