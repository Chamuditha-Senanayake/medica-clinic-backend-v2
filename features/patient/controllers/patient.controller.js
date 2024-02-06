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
import sql from "mssql";

const PatientController = {
  /**
   *
   * get Patient Diagnosis Document
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
   * save a Patient Diagnosis Document
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


  async savePatientDisease(request, response, next) {
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
      const { PatientId, UserSaved, PatientDisease } = request.body;

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        StringValue({ fieldName: "PatientDisease", value: PatientDisease }),
      ];
      console.log(params)

      let patientDiseaseSaveResult = await executeSp({
        spName: `PatientDiseaseSave`,
        params: params,
        connection,
      });

      patientDiseaseSaveResult = patientDiseaseSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient disease data retrived successfully",
        patientDiseaseSaveResult
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

  async getPatientDisposition(request, response, next) {
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
      const { Id, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let patientDispositionGetResult = await executeSp({
        spName: `PatientDispositionGet`,
        params: params,
        connection,
      });

      patientDispositionGetResult = patientDispositionGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient disposition data retrived successfully",
        patientDispositionGetResult
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

  async savePatientDisposition(request, response, next) {
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
        AppointmentId,
        PrescriptionId,
        PatientId,
        DoctorId,
        InstituteId,
        DispositionId,
        DispositionTypeId,
        ServiceTypeId,
        DispositionValue,
        Note,
        NextVisitOption,
        ReminderType,
        ReminderMessage,
        UserSaved,
        Id,
        UserId,
       } = request.body;

      var params = [
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "InstituteId", value: InstituteId }),
        EntityId({ fieldName: "DispositionId", value: DispositionId }),
        EntityId({ fieldName: "DispositionTypeId", value: DispositionTypeId }),
        EntityId({ fieldName: "ServiceTypeId", value: ServiceTypeId }),
        StringValue({ fieldName: "DispositionValue", value: DispositionValue }),
        StringValue({ fieldName: "Note", value: Note }),
        StringValue({ fieldName: "NextVisitOption", value: NextVisitOption }),
        StringValue({ fieldName: "ReminderType", value: ReminderType }),
        StringValue({ fieldName: "ReminderMessage", value: ReminderMessage }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "UserId", value: UserId }),

      ];

      let patientDispositionSaveResult = await executeSp({
        spName: `PatientDispositionSave`,
        params: params,
        connection,
      });

      patientDispositionSaveResult = patientDispositionSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient disposition data retrived successfully",
        patientDispositionSaveResult
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

  async getPatientDrugAllergy(request, response, next) {
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

      let patientDrugAllergyGetResult = await executeSp({
        spName: `PatientDrugAllergyGet`,
        params: params,
        connection,
      });

      patientDrugAllergyGetResult = patientDrugAllergyGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient drug allergy data retrived successfully",
        patientDrugAllergyGetResult
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
