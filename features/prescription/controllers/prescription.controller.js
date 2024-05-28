import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  DateString,
  StringValue,
  SignedInteger,
} from '../../../utils/type-def.js';
import sql from 'mssql';

const PrescriptionController = {
  /**
   *
   * Save prescription
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePrescription(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Prescription.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id = 0,
        PatientUserId,
        DoctorUserId,
        DoctorName,
        PrescriptionName,
        PrescriptionDate,
        ExpirationDate,
        Status = 1,
        UserCreated,
      } = request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'PatientUserId', value: PatientUserId }),
        { name: 'DoctorUserId', type: sql.Numeric, value: DoctorUserId },
        { name: 'DoctorName', type: sql.NVarChar, value: DoctorName },
        {
          name: 'PrescriptionName',
          type: sql.NVarChar,
          value: PrescriptionName,
        },
        DateString({ fieldName: 'PrescriptionDate', value: PrescriptionDate }),
        DateString({ fieldName: 'ExpirationDate', value: ExpirationDate }),
        SignedInteger({ fieldName: 'Status', value: Status }),
        EntityId({ fieldName: 'UserCreated', value: UserCreated }),
      ];

      let prescriptionSaveResult = await executeSp({
        spName: `SavePrescription`,
        params: params,
        connection,
      });

      prescriptionSaveResult = prescriptionSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        prescriptionSaveResult
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
   * get prescription record count
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPrescriptionRecordCount(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Prescription.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, DoctorId, DateFrom, DateTo } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'DoctorId', value: DoctorId }),
        DateString({ fieldName: 'DateFrom', value: DateFrom }),
        DateString({ fieldName: 'DateTo', value: DateTo }),
      ];

      let prescriptionGetResult = await executeSp({
        spName: `Analytic.PrescriptionRecordCountGet`,
        params: params,
        connection,
      });

      prescriptionGetResult = prescriptionGetResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        prescriptionGetResult
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
   * get prescription record disease count
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPrescriptionRecordDiseaseCount(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Prescription.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, DoctorId, DateFrom, DateTo } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'DoctorId', value: DoctorId }),
        DateString({ fieldName: 'DateFrom', value: DateFrom }),
        DateString({ fieldName: 'DateTo', value: DateTo }),
      ];

      let prescriptionRecordDiseaseCountGetResult = await executeSp({
        spName: `Analytic.PrescriptionRecordDiseaseCountGet`,
        params: params,
        connection,
      });

      prescriptionRecordDiseaseCountGetResult =
        prescriptionRecordDiseaseCountGetResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        prescriptionRecordDiseaseCountGetResult
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
   * get prescription record disease details
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPrescriptionRecordDiseaseDetails(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Prescription.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, DoctorId, DateFrom, DateTo } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'DoctorId', value: DoctorId }),
        DateString({ fieldName: 'DateFrom', value: DateFrom }),
        DateString({ fieldName: 'DateTo', value: DateTo }),
      ];

      let prescriptionRecordDiseaseDetailsGetResult = await executeSp({
        spName: `Analytic.PrescriptionRecordDiseaseDetailsGet`,
        params: params,
        connection,
      });

      prescriptionRecordDiseaseDetailsGetResult =
        prescriptionRecordDiseaseDetailsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        prescriptionRecordDiseaseDetailsGetResult
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
   * get prescription record drug count
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPrescriptionRecordDrugCount(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Prescription.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, DoctorId, DateFrom, DateTo } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'DoctorId', value: DoctorId }),
        DateString({ fieldName: 'DateFrom', value: DateFrom }),
        DateString({ fieldName: 'DateTo', value: DateTo }),
      ];

      let prescriptionRecordDrugCountGetResult = await executeSp({
        spName: `Analytic.PrescriptionRecordDrugCountGet`,
        params: params,
        connection,
      });

      prescriptionRecordDrugCountGetResult =
        prescriptionRecordDrugCountGetResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        prescriptionRecordDrugCountGetResult
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

export default PrescriptionController;
