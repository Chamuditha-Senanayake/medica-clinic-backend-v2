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
            yh2DoctorUserId: getUserProfileResult.Id,
            doctorEmail: request.user.email,
          },
          process.env.YH2_ACCESS_REQUEST_TOKEN_EXPIRATION_TIME
        );

        sendEmailFromCustomAccount({
          to: request.user.email,
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
        Token = null,
      } = request.body;

      let decodedToken;
      let params1;
      let token;
      let medicaYH2DoctorSaveResult;

      if (Token) {
        decodedToken = jwt.verify(Token, process.env.JWT_SECRET);
        params1 = [
          EntityId({ fieldName: 'Id', value: decodedToken.yh2DoctorUserId }),
        ];
      } else {
        let params = [
          EntityId({
            fieldName: 'MedicaDoctorId',
            value: MedicaDoctorUserId,
          }),
        ];

        let yh2UserInfo = await executeSp({
          spName: `MedicaYH2DoctorGet`,
          params: params,
          connection,
        });

        params1 = [
          EntityId({
            fieldName: 'Id',
            value: yh2UserInfo.recordsets[0][0].YH2DoctorUserId,
          }),
        ];
      }

      let doctorInfo = await executeSp({
        spName: `UserGetById`,
        params: params1,
        connection,
      });

      doctorInfo = doctorInfo.recordsets[0][0];

      if (doctorInfo && doctorInfo.IsDoctor === true) {
        let params2 = [
          EntityId({
            fieldName: 'YH2DoctorUserId',
            value: doctorInfo.Id,
          }),
        ];

        let medicaYH2DoctorGetResult = await executeSp({
          spName: `MedicaYH2DoctorGet`,
          params: params2,
          connection,
        });

        medicaYH2DoctorGetResult = medicaYH2DoctorGetResult.recordsets[0][0];

        if (medicaYH2DoctorGetResult) {
          token = jwtSign(
            {
              id: medicaYH2DoctorGetResult.Id,
              userId: medicaYH2DoctorGetResult.YH2DoctorUserId,
              email: medicaYH2DoctorGetResult.Email,
              medicaDoctorId: medicaYH2DoctorGetResult.MedicaDoctorId,
            },
            process.env.YH2_ACCESS_REQUEST_TOKEN_EXPIRATION_TIME
          );
        } else {
          let params3 = [
            EntityId({ fieldName: 'Id', value: Id }),
            EntityId({
              fieldName: 'YH2DoctorUserId',
              value: decodedToken.yh2DoctorUserId,
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
              fieldName: 'Email',
              value: decodedToken.doctorEmail,
            }),
            StringValue({
              fieldName: 'RelationStatus',
              value: RelationStatus,
            }),
          ];

          medicaYH2DoctorSaveResult = await executeSp({
            spName: `MedicaYH2DoctorSave`,
            params: params3,
            connection,
          });

          medicaYH2DoctorSaveResult =
            medicaYH2DoctorSaveResult.recordsets[0][0];

          token = jwtSign(
            {
              id: medicaYH2DoctorSaveResult.Id,
              userId: medicaYH2DoctorSaveResult.yh2DoctorUserId,
              email: medicaYH2DoctorSaveResult.Email,
              medicaDoctorId: medicaYH2DoctorSaveResult.MedicaDoctorId,
            },
            process.env.YH2_ACCESS_REQUEST_TOKEN_EXPIRATION_TIME
          );
        }
      } else {
        throw Error('Invalid token.');
      }

      handleResponse(response, 200, 'success', 'Data retrived successfully', {
        token,
      });
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
