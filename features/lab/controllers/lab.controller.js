import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  StringValue,
  SignedInteger,
  TableValueParameters,
} from '../../../utils/type-def.js';
import sql from 'mssql';
import transformMediaResponse from '../../../utils/transformResponse.js';

const LabController = {
  /**
   *
   * Get patient lab reports
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientLabReports(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.LabReport.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { PatientUserId, Page = 0, Limit = 0 } = request.body;

      var params = [
        EntityId({ fieldName: 'PatientUserId', value: PatientUserId }),
        EntityId({ fieldName: 'Page', value: Page }),
        EntityId({ fieldName: 'Limit', value: Limit }),
      ];

      let labReportsGetResult = await executeSp({
        spName: `LabReportsGet`,
        params: params,
        connection,
      });

      //Append files and transform the response
      const transformedResponse = transformMediaResponse(
        labReportsGetResult.recordsets[0]
      );

      //Append patient records and count for pagination
      labReportsGetResult = [
        transformedResponse,
        labReportsGetResult.recordsets[1][0],
      ];

      handleResponse(
        response,
        200,
        'success',
        'Lab reports retrived successfully',
        labReportsGetResult
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
   * Get lab report by Id
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientLabReportById(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.LabReport.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id } = request.body;

      var params = [EntityId({ fieldName: 'Id', value: Id })];

      let labReportGetByIdResult = await executeSp({
        spName: `LabReportGetById`,
        params: params,
        connection,
      });

      labReportGetByIdResult = labReportGetByIdResult.recordsets[0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        labReportGetByIdResult
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
   * Save a patient lab report
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async savePatientLabReports(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.LabReport.VALIDATION_ERROR,
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
        TestType,
        Laboratory,
        Diagnosis,
        Description,
        Files = [],
        Status = 1,
      } = request.body;

      const FilesList = [];
      Files.forEach(File => {
        FilesList.push([File.Path, File.FileType]);
      });

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'PatientUserId', value: PatientUserId }),
        { name: 'RecordId', type: sql.Numeric, value: DoctorUserId },
        { name: 'DoctorUserId', type: sql.Numeric, value: DoctorUserId },
        { name: 'DoctorName', type: sql.NVarChar, value: DoctorName },
        StringValue({ fieldName: 'TestType', value: TestType }),
        StringValue({ fieldName: 'Laboratory', value: Laboratory }),
        StringValue({ fieldName: 'Diagnosis', value: Diagnosis }),
        { name: 'Description', type: sql.NVarChar, value: Description },
        SignedInteger({ fieldName: 'Status', value: Status }),
        EntityId({ fieldName: 'UserCreated', value: request.user.userId }),
        TableValueParameters({
          tableName: 'FileData',
          columns: [
            { columnName: 'Path', type: sql.NVarChar },
            { columnName: 'FileType', type: sql.NVarChar(20) },
          ],
          values: FilesList,
        }),
      ];

      let labReportSaveResult = await executeSp({
        spName: `LabReportSave`,
        params: params,
        connection,
      });

      labReportSaveResult = labReportSaveResult.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Lab report retrieved successfully',
        labReportSaveResult
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
   * Delete patient lab report
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async deletePatientLabReports(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.LabReport.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id } = request.body;

      var params = [EntityId({ fieldName: 'Id', value: Id })];

      await executeSp({
        spName: `LabReportDelete`,
        params: params,
        connection,
      });

      handleResponse(response, 200, 'success', 'Report deleted successfully');
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

export default LabController;
