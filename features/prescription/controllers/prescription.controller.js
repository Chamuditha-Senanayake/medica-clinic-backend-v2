import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  DateString,
  SignedInteger,
  TableValueParameters,
} from '../../../utils/type-def.js';
import sql from 'mssql';

const PrescriptionController = {
  /**
   *
   * Get record
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientPrescriptions(request, response, next) {
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
      const { UserId, Page = 0, Limit = 0 } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let PrescriptionGetResult = await executeSp({
        spName: `PrescriptionGet`,
        params: params,
        connection,
      });

      //Append patient prescriptions and count for pagination
      PrescriptionGetResult = [
        PrescriptionGetResult.recordsets[0],
        PrescriptionGetResult.recordsets[1][0],
      ];

      handleResponse(
        response,
        200,
        'success',
        'Prescriptions retrived successfully',
        PrescriptionGetResult
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
   * Save prescription
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientPrescription(request, response, next) {
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
        DrugDataSet,
        Status = 1,
        UserCreated,
      } = request.body;

      const DrugDataList = [];
      DrugDataSet.forEach(DrugData => {
        DrugDataList.push([
          DrugData.DrugName,
          DrugData.Frequency,
          DrugData.Dosage,
          DrugData.DosageUnit,
          DrugData.Duration,
          DrugData.DurationUnit,
          DrugData.Instructions,
        ]);
      });

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
        TableValueParameters({
          tableName: 'DrugDataSet',
          columns: [
            { columnName: 'DrugName', type: sql.NVarChar(50) },
            { columnName: 'Frequency', type: sql.NVarChar(30) },
            { columnName: 'Dosage', type: sql.Int },
            { columnName: 'DosageUnit', type: sql.NVarChar(30) },
            { columnName: 'Duration', type: sql.NVarChar(30) },
            { columnName: 'DurationUnit', type: sql.NVarChar(30) },
            { columnName: 'Instructions', type: sql.NVarChar(20) },
          ],
          values: DrugDataList,
        }),
      ];

      let prescriptionSaveResult = await executeSp({
        spName: `PrescriptionSave`,
        params: params,
        connection,
      });

      prescriptionSaveResult = prescriptionSaveResult.recordsets;

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
