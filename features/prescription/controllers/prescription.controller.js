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
import transformMediaResponse from '../../../utils/transformResponse.js';

const PrescriptionController = {
  /**
   *
   * Get prescriptions
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
      const { SearchBy, UserId, Page = 0, Limit = 0 } = request.body;

      var params = [
        { name: 'SearchBy', type: sql.NVarChar, value: SearchBy },
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let prescriptionGetResult = await executeSp({
        spName: `PrescriptionGet`,
        params: params,
        connection,
      });

      //Append files and transform the response
      const transformedResponse = transformMediaResponse(
        prescriptionGetResult.recordsets[0]
      );

      // TODO: Populating drugs

      const final = await Promise.all(
        transformedResponse?.map(async prescription => {
          var drugParams = [
            EntityId({ fieldName: 'PrescriptionId', value: prescription?.Id }),
            { name: 'Page', type: sql.Int, value: 0 },
            { name: 'Limit', type: sql.Int, value: null },
          ];
          let prescriptionDrugsGetResult = await executeSp({
            spName: `PrescriptionDrugsGet`,
            params: drugParams,
            connection,
          });

          return {
            ...prescription,
            Drugs: prescriptionDrugsGetResult.recordsets[0],
          };
        })
      );

      prescriptionGetResult = [final, prescriptionGetResult.recordsets[1][0]];

      // ----

      handleResponse(
        response,
        200,
        'success',
        'Prescriptions retrived successfully',
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
   * Get prescription by Id
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientPrescriptionById(request, response, next) {
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
      const { Id } = request.body;

      var params = [EntityId({ fieldName: 'Id', value: Id })];

      let prescriptionGetByIdResult = await executeSp({
        spName: `PrescriptionGetById`,
        params: params,
        connection,
      });

      prescriptionGetByIdResult = prescriptionGetByIdResult.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        prescriptionGetByIdResult
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
        RecordId,
        DoctorUserId,
        DoctorName,
        PrescriptionName,
        PrescriptionDate,
        ExpirationDate,
        DrugDataSet,
        Files = [],
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

      const FilesList = [];
      Files.forEach(File => {
        FilesList.push([File.Path, File.FileType]);
      });

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'PatientUserId', value: PatientUserId }),
        { name: 'RecordId', type: sql.Numeric, value: RecordId },
        { name: 'DoctorUserId', type: sql.Numeric, value: DoctorUserId },
        { name: 'DoctorName', type: sql.NVarChar, value: DoctorName },
        {
          name: 'PrescriptionName',
          type: sql.NVarChar,
          value: PrescriptionName,
        },
        DateString({ fieldName: 'PrescriptionDate', value: PrescriptionDate }),
        {
          name: 'ExpirationDate',
          type: sql.DateTime,
          value: ExpirationDate,
        },
        SignedInteger({ fieldName: 'Status', value: Status }),
        EntityId({ fieldName: 'UserCreated', value: UserCreated }),
        TableValueParameters({
          tableName: 'DrugDataSet',
          columns: [
            { columnName: 'DrugName', type: sql.NVarChar },
            { columnName: 'Frequency', type: sql.NVarChar(60) },
            { columnName: 'Dosage', type: sql.Int },
            { columnName: 'DosageUnit', type: sql.NVarChar(30) },
            { columnName: 'Duration', type: sql.Int },
            { columnName: 'DurationUnit', type: sql.NVarChar(30) },
            { columnName: 'Instructions', type: sql.NVarChar },
          ],
          values: DrugDataList,
        }),
        TableValueParameters({
          tableName: 'FileData',
          columns: [
            { columnName: 'Path', type: sql.NVarChar },
            { columnName: 'FileType', type: sql.NVarChar(20) },
          ],
          values: FilesList,
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
   * Delete prescription
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async deletePatientPrescription(request, response, next) {
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
      const { PrescriptionId } = request.body;

      var params = [
        EntityId({ fieldName: 'PrescriptionId', value: PrescriptionId }),
      ];

      await executeSp({
        spName: `PrescriptionDelete`,
        params: params,
        connection,
      });

      handleResponse(
        response,
        200,
        'success',
        'Prescription deleted successfully'
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
   * Get prescription drugs
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientPrescriptionDrugs(request, response, next) {
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
      const { PrescriptionId, Page = 0, Limit = 0 } = request.body;

      var params = [
        EntityId({ fieldName: 'PrescriptionId', value: PrescriptionId }),
        { name: 'Page', type: sql.Int, value: Page },
        { name: 'Limit', type: sql.Int, value: Limit },
      ];

      let prescriptionDrugsGetResult = await executeSp({
        spName: `PrescriptionDrugsGet`,
        params: params,
        connection,
      });

      if (Limit == 0 || Limit == null) {
        prescriptionDrugsGetResult = prescriptionDrugsGetResult.recordsets;
      } else {
        //Append patient prescriptions and count for pagination
        prescriptionDrugsGetResult = [
          prescriptionDrugsGetResult.recordsets[0],
          prescriptionDrugsGetResult.recordsets[1][0],
        ];
      }

      handleResponse(
        response,
        200,
        'success',
        'Drugs retrived successfully',
        prescriptionDrugsGetResult
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
