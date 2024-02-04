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

const PatientController = {
  /**
   *
   * get disease by [Id, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientDiagnosisDocument(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Patient.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, PatientId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let patientDiagnosisDocumentGetResult = await executeSp({
        spName: `PatientDiagnosisDocumentGet`,
        params: params,
        connection,
      });

      patientDiagnosisDocumentGetResult = patientDiagnosisDocumentGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient data retrived successfully",
        patientDiagnosisDocumentGetResult
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

  /**
   *
   * save a disease
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async savePatientDiagnosisDocument(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Patient.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        PatientId,
        Type,
        FileName,
        Name,
        UserId,
        Id
      } = request.body;

    var params = [
      EntityId({ fieldName: "PatientId", value: PatientId }),
      StringValue({ fieldName: "Type", value: Type }),
      StringValue({ fieldName: "FileName", value: FileName }),
      StringValue({ fieldName: "Name", value: Name }),
      EntityId({ fieldName: "UserId", value: UserId }),
      EntityId({ fieldName: "Id", value: Id }),
    ];

      let PatientDiagnosisDocumentSaveResult = await executeSp({
        spName: `PatientDiagnosisDocumentSave`,
        params: params,
        connection,
      });

      console.log(PatientDiagnosisDocumentSaveResult.recordsets);
      PatientDiagnosisDocumentSaveResult = PatientDiagnosisDocumentSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient data retrieved successfully",
        PatientDiagnosisDocumentSaveResult
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

};

export default PatientController;
