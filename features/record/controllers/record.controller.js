import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString,
} from '../../../utils/type-def.js';
import sql from 'mssql';

const RecordController = {
  /**
   *
   * Get record
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRecords(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Record.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, Page = 0, Limit = 0 } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let recordsGetResult = await executeSp({
        spName: `PatientRecordsGet`,
        params: params,
        connection,
      });

      //Append patient records and count for pagination
      recordsGetResult = [
        recordsGetResult.recordsets[0],
        recordsGetResult.recordsets[1][0],
      ];

      handleResponse(
        response,
        200,
        'success',
        'Records retrived successfully',
        recordsGetResult
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
   * Save a record
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async savePatientRecord(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Record.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        UserId,
        DoctorUserId,
        DoctorName,
        RecordType,
        BodyPart,
        SubBodyPart,
        SubBodyPartType,
        Date,
        Diagnosis,
        Symptoms,
        Notes,
        Status = 1,
        UserSaved,
      } = request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'UserId', value: UserId }),
        { name: 'DoctorUserId', type: sql.Numeric, value: DoctorUserId },
        { name: 'DoctorName', type: sql.NVarChar, value: DoctorName },
        StringValue({ fieldName: 'RecordType', value: RecordType }),
        StringValue({ fieldName: 'BodyPart', value: BodyPart }),
        StringValue({ fieldName: 'SubBodyPart', value: SubBodyPart }),
        { name: 'SubBodyPartType', type: sql.NVarChar, value: SubBodyPartType },
        DateString({ fieldName: 'Date', value: Date }),
        { name: 'Diagnosis', type: sql.NVarChar, value: Diagnosis },
        StringValue({ fieldName: 'Symptoms', value: Symptoms }),
        StringValue({ fieldName: 'Notes', value: Notes }),
        SignedInteger({ fieldName: 'Status', value: Status }),
        EntityId({ fieldName: 'UserCreated', value: UserSaved }),
      ];

      let recordSaveResult = await executeSp({
        spName: `PatientRecordSave`,
        params: params,
        connection,
      });

      recordSaveResult = recordSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Record retrieved successfully',
        recordSaveResult
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
   * Delete record
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async deletePatientRecords(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Record.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, Id } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'Id', value: Id }),
      ];

      await executeSp({
        spName: `PatientRecordDelete`,
        params: params,
        connection,
      });

      handleResponse(response, 200, 'success', 'Records deleted successfully');
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
   * Get record body parts
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRecordBodyParts(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Record.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId } = request.body;

      var params = [EntityId({ fieldName: 'UserId', value: UserId })];

      let patientRecordBodyPartsGetResult = await executeSp({
        spName: `PatientRecordBodyPartsGet`,
        params: params,
        connection,
      });

      patientRecordBodyPartsGetResult =
        patientRecordBodyPartsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        recordGetResult
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

export default RecordController;
