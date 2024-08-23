import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  StringValue,
  SignedInteger,
} from '../../../utils/type-def.js';
import jwt from 'jsonwebtoken';
import jwtSign from '../../../utils/jwtSign.js';
import { sendEmailFromCustomAccount } from '../../../utils/sendMail.js';

const MedicaController = {
  /**
   *
   * Request access by user
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async userAccessRequest(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Medica.VALIDATION_ERROR,
        data: errors,
      });
    }

    let connection = request.app.locals.db;

    try {
      let params = [EntityId({ fieldName: 'Id', value: request.user.userId })];

      let getUserProfileResult = await executeSp({
        spName: `UserGetById`,
        params: params,
        connection,
      });

      getUserProfileResult = getUserProfileResult?.recordsets[0][0];

      //Only doctors are allowed to perform this operation.
      if (getUserProfileResult && getUserProfileResult.IsDoctor === true) {
        let token;

        token = jwtSign(
          {
            YH2DoctorUserId: getUserProfileResult.Id,
            doctorEmail: request.user.email,
          },
          process.env.YH2_ACCESS_REQUEST_TOKEN_EXPIRATION_TIME
        );

        sendEmailFromCustomAccount({
          to: 'chamudithacbs@gmail.com',
          subject: 'YH2 Access Request ',
          html: `<p>Hello ${getUserProfileResult.FName},</p><h2>YH2 Access Request</h2><p>Copy and paste the below token in the medica UI to proceed:</p> <b><i>${token}</i></b>`,
        });

        handleResponse(response, 200, 'success', 'Email sent');
      } else {
        throw Error('You are not allowed to perform this operation.');
      }
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
  async userAccessRequestValidation(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Medica.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id = 0,
        MedicaDoctorUserId,
        MedicaDoctorId,
        RelationStatus = 'active',
        Token,
      } = request.body;

      let decodedToken = jwt.verify(Token, process.env.JWT_SECRET);

      let params1 = [
        EntityId({ fieldName: 'Id', value: decodedToken.YH2DoctorUserId }),
      ];

      let doctorInfo = await executeSp({
        spName: `UserGetById`,
        params: params1,
        connection,
      });

      doctorInfo = doctorInfo.recordsets[0][0];

      let medicaYH2DoctorSaveResult;

      if (doctorInfo && doctorInfo.IsDoctor === true) {
        let params2 = [
          EntityId({ fieldName: 'Id', value: Id }),
          EntityId({
            fieldName: 'YH2DoctorUserId',
            value: decodedToken.YH2DoctorUserId,
          }),
          EntityId({
            fieldName: 'MedicaDoctorUserId',
            value: MedicaDoctorUserId,
          }),
          EntityId({
            fieldName: 'MedicaDoctorId',
            value: MedicaDoctorId,
          }),
          StringValue({
            fieldName: 'RelationStatus',
            value: RelationStatus,
          }),
        ];
        //TODO:check whether doctor already registered in the medicaYH2 db before save (create sp getMedicaYH2DoctorById)
        medicaYH2DoctorSaveResult = await executeSp({
          spName: `MedicaYH2DoctorSave`,
          params: params2,
          connection,
        });

        medicaYH2DoctorSaveResult = medicaYH2DoctorSaveResult.recordsets[0][0];
      } else {
        throw Error('Invalid token.');
      }

      //TODO: generate token and send it instead of the medicaYH2DoctorSaveResult
      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        medicaYH2DoctorSaveResult
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

export default MedicaController;
