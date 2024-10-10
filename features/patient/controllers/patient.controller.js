import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString,
  TableValueParameters,
} from "../../../utils/type-def.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";

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

      patientDiagnosisDocumentGetResult =
        patientDiagnosisDocumentGetResult.recordsets[0];

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
      const { PatientId, Type, FileName, Name, UserId, Id } = request.body;

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
      PatientDiagnosisDocumentSaveResult =
        PatientDiagnosisDocumentSaveResult.recordsets[0][0];

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
      console.log(params);

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

  async getPatientDisease(request, response, next) {
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
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({
          fieldName: "PatientId",
          value: deHashPatientId({ patientId: PatientId }),
        }),
      ];
      console.log(params);

      let patientDiseaseGetResult = await executeSp({
        spName: `PatientDiseaseGet`,
        params: params,
        connection,
      });

      patientDiseaseGetResult = patientDiseaseGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient disease data retrived successfully",
        patientDiseaseGetResult
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

      patientDispositionGetResult = patientDispositionGetResult.recordsets[0];

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

      patientDispositionSaveResult =
        patientDispositionSaveResult.recordsets[0][0];

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
        EntityId({
          fieldName: "PatientId",
          value: deHashPatientId({ patientId: PatientId }),
        }),
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

  /**
   *
   * get Gyno Obstetrics History
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getGynoObstetricsHistory(request, response, next) {
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

      let gynoObstetricsHistoryGetResult = await executeSp({
        spName: `GynoObstetricsHistoryGet`,
        params: params,
        connection,
      });

      gynoObstetricsHistoryGetResult =
        gynoObstetricsHistoryGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        gynoObstetricsHistoryGetResult
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
   * save Gyno Obstetrics History
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveGynoObstetricsHistory(request, response, next) {
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
      const { Id, PatientId, GynoObstetricsHistory, Status, UserSaved } =
        request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({
          fieldName: "GynoObstetricsHistory",
          value: GynoObstetricsHistory,
        }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let gynoObstetricsHistorySaveResult = await executeSp({
        spName: `GynoObstetricsHistorySave`,
        params: params,
        connection,
      });

      console.log(gynoObstetricsHistorySaveResult.recordsets);
      gynoObstetricsHistorySaveResult =
        gynoObstetricsHistorySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        gynoObstetricsHistorySaveResult
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
   * Delete Patient Diagnosis Document
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async deletePatientDiagnosisDocument(request, response, next) {
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

      let patientDiagnosisDocumentDeleteResult = await executeSp({
        spName: `PatientDiagnosisDocumentDelete`,
        params: params,
        connection,
      });

      patientDiagnosisDocumentDeleteResult =
        patientDiagnosisDocumentDeleteResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Deleted successfully",
        patientDiagnosisDocumentDeleteResult
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
   * get Patient Diagnosis Document
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientNewFoodAllergy(request, response, next) {
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
        EntityId({
          fieldName: "PatientId",
          value: deHashPatientId({ patientId: PatientId }),
        }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let patientNewFoodAllergyGetResult = await executeSp({
        spName: `PatientNewFoodAllergyGet`,
        params: params,
        connection,
      });

      patientNewFoodAllergyGetResult =
        patientNewFoodAllergyGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Food allergy data retrived successfully",
        patientNewFoodAllergyGetResult
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
   * save Patient New Food Allergy
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async savePatientNewFoodAllergy(request, response, next) {
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
      const { Id, PatientId, AllergyFoods, Status, UserSaved } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "AllergyFoods", value: AllergyFoods }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let patientNewFoodAllergySaveResult = await executeSp({
        spName: `PatientNewFoodAllergySave`,
        params: params,
        connection,
      });

      console.log(patientNewFoodAllergySaveResult.recordsets);
      patientNewFoodAllergySaveResult =
        patientNewFoodAllergySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        patientNewFoodAllergySaveResult
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
   * get Patient
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatient(request, response, next) {
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
        UserId,
        NIC = "",
        Passport = "",
        Mobile = "",
        BedHeadTicketNumber = "",
        ClinicId = "",
        UniqueId = "",
        Name = "",
        DateOfBirth,
        ParentId = 0,
        Guid = 0,
        Address = "",
        Id = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        StringValue({ fieldName: "NIC", value: NIC }),
        StringValue({ fieldName: "Passport", value: Passport }),
        StringValue({ fieldName: "Mobile", value: Mobile }),
        StringValue({
          fieldName: "BedHeadTicketNumber",
          value: BedHeadTicketNumber,
        }),
        StringValue({ fieldName: "ClinicId", value: ClinicId }),
        StringValue({ fieldName: "UniqueId", value: UniqueId }),
        StringValue({ fieldName: "Name", value: Name }),
        EntityId({ fieldName: "ParentId", value: ParentId }),
        EntityId({ fieldName: "Guid", value: Guid }),
        StringValue({ fieldName: "Address", value: Address }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      if (DateOfBirth) {
        params.push(
          DateString({ fieldName: "DateOfBirth", value: DateOfBirth })
        );
      }

      let patientGetResult = await executeSp({
        spName: `PatientGet`,
        params: params,
        connection,
      });

      patientGetResult = patientGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Patient retrived successfully",
        patientGetResult
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
   * get Patient New Surgery
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientNewSurgery(request, response, next) {
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

      let patientNewSurgeryGetResult = await executeSp({
        spName: `PatientNewSurgeryGet`,
        params: params,
        connection,
      });

      patientNewSurgeryGetResult = patientNewSurgeryGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Surgery data retrived successfully",
        patientNewSurgeryGetResult
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
   * save Patient New Surgery
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientNewSurgery(request, response, next) {
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
      const { Id, PatientId, Surgeries, Status, UserSaved } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "Surgeries", value: Surgeries }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let patientNewSurgerySaveResult = await executeSp({
        spName: `PatientNewSurgerySave`,
        params: params,
        connection,
      });

      patientNewSurgerySaveResult =
        patientNewSurgerySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Surgery data retrived successfully",
        patientNewSurgerySaveResult
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
   * get patient other surgery
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientOtherAllergy(request, response, next) {
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

      let patientOtherAllergyGetResult = await executeSp({
        spName: `PatientOtherAllergyGet`,
        params: params,
        connection,
      });

      patientOtherAllergyGetResult = patientOtherAllergyGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientOtherAllergyGetResult
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
   * save patient other surgery
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientOtherAllergy(request, response, next) {
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
      const { Id, PatientId, Allergies, Status, UserSaved } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "Allergies", value: Allergies }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let patientOtherAllergySaveResult = await executeSp({
        spName: `PatientOtherAllergySave`,
        params: params,
        connection,
      });

      patientOtherAllergySaveResult =
        patientOtherAllergySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientOtherAllergySaveResult
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
   * get patient other diseases
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientOtherDiseases(request, response, next) {
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

      let patientOtherDiseasesGetResult = await executeSp({
        spName: `PatientOtherDiseasesGet`,
        params: params,
        connection,
      });

      patientOtherDiseasesGetResult =
        patientOtherDiseasesGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientOtherDiseasesGetResult
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
   * save patient other diseases
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientOtherDiseases(request, response, next) {
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
      const { Id, PatientId, Diseases, Status, UserSaved } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "Diseases", value: Diseases }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let patientOtherDiseasesSaveResult = await executeSp({
        spName: `PatientOtherDiseasesSave`,
        params: params,
        connection,
      });

      patientOtherDiseasesSaveResult =
        patientOtherDiseasesSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientOtherDiseasesSaveResult
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
   * get patient relatives
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRelatives(request, response, next) {
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
      const { Id, PatientId, RelationId, TypeId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "RelationId", value: RelationId }),
        EntityId({ fieldName: "TypeId", value: TypeId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let patientRelativesGetResult = await executeSp({
        spName: `PatientRelativesGet`,
        params: params,
        connection,
      });

      patientRelativesGetResult = patientRelativesGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientRelativesGetResult
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

  /*
   *
   * get patient remark
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRemark(request, response, next) {
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

      let patientRemarkGetResult = await executeSp({
        spName: `PatientRemarkGet`,
        params: params,
        connection,
      });

      patientRemarkGetResult = patientRemarkGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientRemarkGetResult
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
   * save patient remarkS
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientRemark(request, response, next) {
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
      const { PatientId, Details, Status, UserSaved, Id } = request.body;

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "Details", value: Details }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let patientRemarkSaveResult = await executeSp({
        spName: `PatientRemarkSave`,
        params: params,
        connection,
      });

      patientRemarkSaveResult = patientRemarkSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientRemarkSaveResult
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

  /*
   *
   * get patient reminder
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientReminder(request, response, next) {
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
      const { PatientId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let patientReminderGetResult = await executeSp({
        spName: `PatientReminderGet`,
        params: params,
        connection,
      });

      patientReminderGetResult = patientReminderGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Patient reminder retrived successfully",
        patientReminderGetResult
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

  /*
   *
   * save patient reminder
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientReminder(request, response, next) {
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
        Id,
        PatientId,
        Subject,
        ReminderType,
        Description,
        Date,
        Time,
        Status,
        UserSaved,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "Subject", value: Subject }),
        StringValue({ fieldName: "ReminderType", value: ReminderType }),
        StringValue({ fieldName: "Description", value: Description }),
        DateString({ fieldName: "Date", value: Date }),
        DateString({ fieldName: "Time", value: Time }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let patientReminderSaveResult = await executeSp({
        spName: `PatientReminderSave`,
        params: params,
        connection,
      });

      patientReminderSaveResult = patientReminderSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Patient reminder retrived successfully",
        patientReminderSaveResult
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

  /*
   *
   * save patient report
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientReport(request, response, next) {
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
        AppointmentId,
        FileName,
        FileLocation,
        ReportType,
        Description,
        Status,
        UserSaved,
        Id,
      } = request.body;

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),

        StringValue({ fieldName: "FileName", value: FileName }),
        StringValue({ fieldName: "FileLocation", value: FileLocation }),
        StringValue({ fieldName: "ReportType", value: ReportType }),
        StringValue({ fieldName: "Description", value: Description }),

        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "Status", value: Status }),
      ];

      let patientReportSaveResult = await executeSp({
        spName: `PatientReportSave`,
        params: params,
        connection,
      });

      patientReportSaveResult = patientReportSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Patient report retrived successfully",
        patientReportSaveResult
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

  /*
   *
   * get patient robson info
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRobsonInfo(request, response, next) {
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
      const { PatientId } = request.body;

      var params = [EntityId({ fieldName: "PatientId", value: PatientId })];

      let patientRobsonInfoGetResult = await executeSp({
        spName: `PatientRobsonInfoGet`,
        params: params,
        connection,
      });

      patientRobsonInfoGetResult = patientRobsonInfoGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientRobsonInfoGetResult
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

  /*
   *
   * get patient robson report data
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRobsonReportData(request, response, next) {
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
      const { UserId } = request.body;

      var params = [EntityId({ fieldName: "UserId", value: UserId })];

      let patientRobsonReportDataGetResult = await executeSp({
        spName: `PatientRobsonReportDataGet`,
        params: params,
        connection,
      });

      patientRobsonReportDataGetResult =
        patientRobsonReportDataGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientRobsonReportDataGetResult
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

  /*
   *
   * get patient robson info save
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientRobsonInfo(request, response, next) {
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
        Id,
        PatientId,
        Parity,
        PreviousCs,
        OnsetOfLabour,
        NoOfFetuses,
        GestationalAge,
        Presentation,
        DeliveryMode,
        DeliveryOutcome,
        DeliveryComplications,
        CsElectiveIndications,
        CsEmergencyIndications,
        Notes,
        UserSaved,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "Parity", value: Parity }),
        StringValue({ fieldName: "PreviousCs", value: PreviousCs }),
        StringValue({ fieldName: "OnsetOfLabour", value: OnsetOfLabour }),
        StringValue({ fieldName: "NoOfFetuses", value: NoOfFetuses }),
        StringValue({ fieldName: "GestationalAge", value: GestationalAge }),
        StringValue({ fieldName: "Presentation", value: Presentation }),
        StringValue({ fieldName: "DeliveryMode", value: DeliveryMode }),
        StringValue({ fieldName: "DeliveryOutcome", value: DeliveryOutcome }),
        StringValue({
          fieldName: "DeliveryComplications",
          value: DeliveryComplications,
        }),
        StringValue({
          fieldName: "CsElectiveIndications",
          value: CsElectiveIndications,
        }),
        StringValue({
          fieldName: "CsEmergencyIndications",
          value: CsEmergencyIndications,
        }),
        StringValue({ fieldName: "Notes", value: Notes }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let patientRobsonInfoSaveResult = await executeSp({
        spName: `PatientRobsonInfoSave`,
        params: params,
        connection,
      });

      patientRobsonInfoSaveResult =
        patientRobsonInfoSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientRobsonInfoSaveResult
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

  /*
   *
   * get patient status
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientStatus(request, response, next) {
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
      const { UserId, Id, PatientId } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
      ];

      let patientStatusGetResult = await executeSp({
        spName: `PatientStatusGet`,
        params: params,
        connection,
      });

      patientStatusGetResult = patientStatusGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientStatusGetResult
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

  /*
   *
   * save patient
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatient(request, response, next) {
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
        Id,
        Title,
        FirstName,
        MiddleName,
        LastName,
        NIC,
        Passport,
        Mobile,
        BedHeadTicketNumber,
        ClinicId,
        UniqueId,
        Email,
        DateOfBirth,
        Gender,
        ParentId,
        PatientTypeId,
        BloodGroup,
        InvalidOTPAttempts,
        AddressId,
        AddressLine1 = "",
        AddressLine2 = "",
        Suburb,
        City,
        Postcode,
        Province,
        Country,
        RelationId,
        RelationTypeId,
        EmergencyContact,
        Occupation,
        MaritalStatus,
        Status = 0,
        UserSaved,
        PHIArea,
        MOH,
        GNDivision,
        AgeGroupId,
        EthnicGroupId,
        EducationLevelId,
        ReligionId,
        SpiritualityId,
        IncomeGroupId,
        PatientStatusSave,
        PatientStatusId,
        PatientStatusStatusType /*1 - Hostapitalized, 2 - Dead*/,
        PatientStatusStatusDate,
        PatientStatusStatus,
        Guid,
        UserId,
        LocalTran,
        OperationUniqueId,
      } = request.body;

      var params = [
        EntityId({
          fieldName: "Id",
          value: deHashPatientId({ patientId: Id }),
        }),

        StringValue({ fieldName: "Title", value: Title }),
        StringValue({ fieldName: "FirstName", value: FirstName }),
        StringValue({ fieldName: "MiddleName", value: MiddleName }),
        StringValue({ fieldName: "LastName", value: LastName }),
        StringValue({ fieldName: "NIC", value: NIC }),
        StringValue({ fieldName: "Passport", value: Passport }),
        StringValue({ fieldName: "Mobile", value: Mobile }),
        StringValue({
          fieldName: "BedHeadTicketNumber",
          value: BedHeadTicketNumber,
        }),
        StringValue({ fieldName: "ClinicId", value: ClinicId }),
        StringValue({ fieldName: "UniqueId", value: UniqueId }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "DateOfBirth", value: DateOfBirth }),
        StringValue({ fieldName: "Gender", value: Gender }),
        EntityId({ fieldName: "ParentId", value: ParentId }),
        EntityId({ fieldName: "PatientTypeId", value: PatientTypeId }),
        StringValue({ fieldName: "BloodGroup", value: BloodGroup }),
        EntityId({
          fieldName: "InvalidOTPAttempts",
          value: InvalidOTPAttempts,
        }),
        EntityId({ fieldName: "AddressId", value: AddressId }),
        StringValue({ fieldName: "AddressLine1", value: AddressLine1 }),
        StringValue({ fieldName: "AddressLine2", value: AddressLine2 }),
        StringValue({ fieldName: "Suburb", value: Suburb }),
        StringValue({ fieldName: "City", value: City }),
        StringValue({ fieldName: "Postcode", value: Postcode }),
        StringValue({ fieldName: "Province", value: Province }),
        StringValue({ fieldName: "Country", value: Country }),
        // EntityId({ fieldName: "RelationId", value: RelationId }),
        // EntityId({ fieldName: "RelationTypeId", value: RelationTypeId }),
        StringValue({ fieldName: "EmergencyContact", value: EmergencyContact }),
        StringValue({ fieldName: "Occupation", value: Occupation }),
        SignedInteger({
          fieldName: "MaritalStatus",
          value: MaritalStatus,
        }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        StringValue({ fieldName: "PHIArea", value: PHIArea }),
        StringValue({ fieldName: "MOH", value: MOH }),
        StringValue({ fieldName: "GNDivision", value: GNDivision }),
        EntityId({ fieldName: "AgeGroupId", value: AgeGroupId }),
        EntityId({ fieldName: "EthnicGroupId", value: EthnicGroupId }),
        EntityId({ fieldName: "EducationLevelId", value: EducationLevelId }),
        EntityId({ fieldName: "ReligionId", value: ReligionId }),
        EntityId({ fieldName: "SpiritualityId", value: SpiritualityId }),
        EntityId({ fieldName: "IncomeGroupId", value: IncomeGroupId }),
        SignedInteger({
          fieldName: "PatientStatusSave",
          value: PatientStatusSave,
        }),
        EntityId({ fieldName: "PatientStatusId", value: PatientStatusId }),
        SignedInteger({
          fieldName: "PatientStatusStatusType",
          value: PatientStatusStatusType,
        }),
        DateString({
          fieldName: "PatientStatusStatusDate",
          value: PatientStatusStatusDate,
        }),
        SignedInteger({
          fieldName: "PatientStatusStatus",
          value: PatientStatusStatus,
        }),
        EntityId({ fieldName: "Guid", value: Guid }),
        EntityId({ fieldName: "UserId", value: UserId }),
        SignedInteger({
          fieldName: "LocalTran",
          value: LocalTran,
        }),
        StringValue({
          fieldName: "OperationUniqueId",
          value: OperationUniqueId,
        }),
      ];

      let patientSaveResult = await executeSp({
        spName: `PatientSave`,
        params: params,
        connection,
      });

      patientSaveResult = patientSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Patient retrived successfully",
        patientSaveResult
      );
    } catch (error) {
      console.log(error);
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

  /*
   *
   * save consultation
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async saveConsultation(request, response, next) {
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
        AppointmentId,
        PrescriptionRecordId,
        UserSaved,
        CovidSymptoms,
        CovidLab,
        Treatment,
        DisCharge,
        PatientCare,
        WasteManagment,
        CovidSigns,
        RiskFactors,
        Management,
        Advice,
        Prevention,
      } = request.body;

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({
          fieldName: "PrescriptionRecordId",
          value: PrescriptionRecordId,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),

        StringValue({ fieldName: "CovidSymptoms", value: CovidSymptoms }),
        StringValue({ fieldName: "CovidLab", value: CovidLab }),
        StringValue({ fieldName: "Treatment", value: Treatment }),
        StringValue({ fieldName: "DisCharge", value: DisCharge }),
        StringValue({ fieldName: "PatientCare", value: PatientCare }),
        StringValue({ fieldName: "WasteManagment", value: WasteManagment }),
        StringValue({ fieldName: "CovidSigns", value: CovidSigns }),
        StringValue({ fieldName: "RiskFactors", value: RiskFactors }),
        StringValue({ fieldName: "Management", value: Management }),
        StringValue({ fieldName: "Advice", value: Advice }),
        StringValue({ fieldName: "Prevention", value: Prevention }),
      ];

      let consultationSaveResult = await executeSp({
        spName: `ConsultationSave`,
        params: params,
        connection,
      });

      consultationSaveResult = consultationSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        consultationSaveResult
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

  /*
   *
   * get patient deceased
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientDeceased(request, response, next) {
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
        UserId,
        PatientId,
        NIC,
        Passport,
        Mobile,
        MOH,
        GNDivision,
        Id,
        Limit,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "NIC", value: NIC }),
        StringValue({ fieldName: "Passport", value: Passport }),
        StringValue({ fieldName: "Mobile", value: Mobile }),
        StringValue({ fieldName: "MOH", value: MOH }),
        StringValue({ fieldName: "GNDivision", value: GNDivision }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "Limit", value: Limit }),
      ];

      let PatientDeceasedGetResult = await executeSp({
        spName: `PatientDeceasedGet`,
        params: params,
        connection,
      });

      PatientDeceasedGetResult = PatientDeceasedGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        PatientDeceasedGetResult
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

  /*
   *
   * get illness data detail
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getIllnessDataDetail(request, response, next) {
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
        UserId,
        SessionId,
        AppointmentId,
        PrescriptionRecordId,
        DoctorId,
        PatientId,
        Id,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({
          fieldName: "PrescriptionRecordId",
          value: PrescriptionRecordId,
        }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let illnessDataDetailGetResult = await executeSp({
        spName: `IllnessDataDetailGet`,
        params: params,
        connection,
      });

      illnessDataDetailGetResult = illnessDataDetailGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Illness data retrived successfully",
        illnessDataDetailGetResult
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

  /*
   *
   * save illness data detail
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async saveIllnessDataDetail(request, response, next) {
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
        AppointmentNumber,
        AppointmentSessionId,
        AppointmentStatus,
        PatientId,
        PatientTitle,
        PatientFirstName,
        PatientMiddleName,
        PatientLastName,
        PatientNIC,
        PatientPassport,
        PatientMobile,
        PatientEmail,
        PatientDateOfBirth,
        PatientGender,
        PatientParentId,
        PatientPatientTypeId,
        PatientBloodGroup,
        PatientStatus,
        EpisodeType,
        PrescriptionRecordId,
        CurrentEpisodeDuration,
        TotalDuration,
        OnsetDescription,
        Profile,
        PrecipitatingFactors,
        PredisposingFactors,
        RelievingFactors,
        FunctionalStatus,
        FamilyMedicineVitalSigns,
        ChronicDiseaseMx,
        CurrentMedications,
        Weight,
        Height,
        BloodPressureSystolic,
        BloodPressureDiastolic,
        Temperature,
        Pulse,
        RespiratoryRate,
        WaistCircumference,
        Status,
        UserSaved,
        Id,
      } = request.body;

      var params = [
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "AppointmentNumber", value: AppointmentNumber }),
        EntityId({
          fieldName: "AppointmentSessionId",
          value: AppointmentSessionId,
        }),
        SignedInteger({
          fieldName: "AppointmentStatus",
          value: AppointmentStatus,
        }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "PatientTitle", value: PatientTitle }),
        StringValue({ fieldName: "PatientFirstName", value: PatientFirstName }),
        StringValue({
          fieldName: "PatientMiddleName",
          value: PatientMiddleName,
        }),
        StringValue({ fieldName: "PatientLastName", value: PatientLastName }),
        StringValue({ fieldName: "PatientNIC", value: PatientNIC }),
        StringValue({ fieldName: "PatientPassport", value: PatientPassport }),
        StringValue({ fieldName: "PatientMobile", value: PatientMobile }),
        StringValue({ fieldName: "PatientEmail", value: PatientEmail }),
        DateString({
          fieldName: "PatientDateOfBirth",
          value: PatientDateOfBirth,
        }),
        StringValue({ fieldName: "PatientGender", value: PatientGender }),
        EntityId({ fieldName: "PatientParentId", value: PatientParentId }),
        EntityId({
          fieldName: "PatientPatientTypeId",
          value: PatientPatientTypeId,
        }),
        StringValue({
          fieldName: "PatientBloodGroup",
          value: PatientBloodGroup,
        }),
        SignedInteger({
          fieldName: "PatientStatus",
          value: PatientStatus,
        }),
        SignedInteger({
          fieldName: "EpisodeType",
          value: EpisodeType,
        }),
        EntityId({
          fieldName: "PrescriptionRecordId",
          value: PrescriptionRecordId,
        }),
        StringValue({
          fieldName: "CurrentEpisodeDuration",
          value: CurrentEpisodeDuration,
        }),
        StringValue({ fieldName: "TotalDuration", value: TotalDuration }),
        StringValue({ fieldName: "OnsetDescription", value: OnsetDescription }),
        StringValue({ fieldName: "Profile", value: Profile }),
        StringValue({
          fieldName: "PrecipitatingFactors",
          value: PrecipitatingFactors,
        }),
        StringValue({
          fieldName: "PredisposingFactors",
          value: PredisposingFactors,
        }),
        StringValue({ fieldName: "RelievingFactors", value: RelievingFactors }),
        StringValue({ fieldName: "FunctionalStatus", value: FunctionalStatus }),
        StringValue({
          fieldName: "FamilyMedicineVitalSigns",
          value: FamilyMedicineVitalSigns,
        }),
        StringValue({ fieldName: "ChronicDiseaseMx", value: ChronicDiseaseMx }),
        StringValue({
          fieldName: "CurrentMedications",
          value: CurrentMedications,
        }),
        StringValue({ fieldName: "Weight", value: Weight }),
        StringValue({ fieldName: "Height", value: Height }),
        StringValue({
          fieldName: "BloodPressureSystolic",
          value: BloodPressureSystolic,
        }),
        StringValue({
          fieldName: "BloodPressureDiastolic",
          value: BloodPressureDiastolic,
        }),
        StringValue({ fieldName: "Temperature", value: Temperature }),
        StringValue({ fieldName: "Pulse", value: Pulse }),
        StringValue({ fieldName: "RespiratoryRate", value: RespiratoryRate }),
        StringValue({
          fieldName: "WaistCircumference",
          value: WaistCircumference,
        }),
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let illnessDataDetailSaveResult = await executeSp({
        spName: `IllnessDataDetailSave`,
        params: params,
        connection,
      });

      illnessDataDetailSaveResult = illnessDataDetailSaveResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Illness data retrived successfully",
        illnessDataDetailSaveResult
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
   * get patient count
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientCount(request, response, next) {
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
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        DateString({ fieldName: "DateFrom", value: DateFrom }),
        DateString({ fieldName: "DateTo", value: DateTo }),
      ];

      let patientCountGetResult = await executeSp({
        spName: `Analytic.PatientCountGet`,
        params: params,
        connection,
      });

      patientCountGetResult = patientCountGetResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Patient count retrived successfully",
        patientCountGetResult
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
   * Save Patient Drug Allergy
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientDrugAllergy(request, response, next) {
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
      const { PatientId, UserSaved, PatientAllergyDrug } = request.body;

      const PatientAllergyDrugList = [];
      PatientAllergyDrug.forEach((patientAllergyDrug) => {
        PatientAllergyDrugList.push([
          patientAllergyDrug.Id,
          patientAllergyDrug.AllergyDrugId,
          patientAllergyDrug.Name,
          patientAllergyDrug.Comments,
          patientAllergyDrug.Status,
        ]);
      });

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),

        TableValueParameters({
          tableName: "PatientAllergyDrug",
          columns: [
            { columnName: "Id", type: sql.Int },
            { columnName: "AllergyDrugId", type: sql.Int },
            { columnName: "Name", type: sql.VarChar(50) },
            { columnName: "Comments", type: sql.VarChar() },
            { columnName: "Status", type: sql.TinyInt },
          ],
          values: PatientAllergyDrugList,
        }),
      ];

      let patientDrugAllergySaveResult = await executeSp({
        spName: `PatientDrugAllergySave`,
        params: params,
        connection,
      });

      patientDrugAllergySaveResult =
        patientDrugAllergySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientDrugAllergySaveResult
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
   * Save Patient Food Allergy
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async savePatientFoodAllergy(request, response, next) {
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
      const { PatientId, UserSaved, PatientAllergyFood } = request.body;

      const PatientAllergyFoodList = [];
      PatientAllergyFood.forEach((patientAllergyFood) => {
        PatientAllergyFoodList.push([
          patientAllergyFood.Id,
          patientAllergyFood.AllergyDrugId,
          patientAllergyFood.Name,
          patientAllergyFood.Comments,
          patientAllergyFood.Status,
        ]);
      });

      var params = [
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),

        TableValueParameters({
          tableName: "PatientAllergyFood",
          columns: [
            { columnName: "Id", type: sql.Int },
            { columnName: "AllergyFoodId", type: sql.Int },
            { columnName: "Name", type: sql.VarChar(50) },
            { columnName: "Comments", type: sql.VarChar() },
            { columnName: "Status", type: sql.TinyInt },
          ],
          values: PatientAllergyFoodList,
        }),
      ];

      let patientFoodAllergySaveResult = await executeSp({
        spName: `PatientFoodAllergySave`,
        params: params,
        connection,
      });

      patientFoodAllergySaveResult =
        patientFoodAllergySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        patientFoodAllergySaveResult
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
