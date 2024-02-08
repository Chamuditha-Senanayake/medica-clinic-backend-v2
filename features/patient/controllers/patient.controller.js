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

      gynoObstetricsHistoryGetResult = gynoObstetricsHistoryGetResult.recordsets;

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
      const {
        Id,
        PatientId,
        GynoObstetricsHistory,
        Status,
        UserSaved,
      } = request.body;

    var params = [
      EntityId({ fieldName: "Id", value: Id }),
      EntityId({ fieldName: "PatientId", value: PatientId }),
      StringValue({ fieldName: "GynoObstetricsHistory", value: GynoObstetricsHistory }),
      EntityId({ fieldName: "Status", value: Status }),
      EntityId({ fieldName: "UserSaved", value: UserSaved }),
    ];

      let gynoObstetricsHistorySaveResult = await executeSp({
        spName: `GynoObstetricsHistorySave`,
        params: params,
        connection,
      });

      console.log(gynoObstetricsHistorySaveResult.recordsets);
      gynoObstetricsHistorySaveResult = gynoObstetricsHistorySaveResult.recordsets;

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

      patientDiagnosisDocumentDeleteResult = patientDiagnosisDocumentDeleteResult.recordsets;

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
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let patientNewFoodAllergyGetResult = await executeSp({
        spName: `PatientNewFoodAllergyGet`,
        params: params,
        connection,
      });

      patientNewFoodAllergyGetResult = patientNewFoodAllergyGetResult.recordsets;

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
      const {
        Id,
        PatientId,
        AllergyFoods,
        Status,
        UserSaved,
      } = request.body;

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
      patientNewFoodAllergySaveResult = patientNewFoodAllergySaveResult.recordsets;

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
        NIC,
        Passport,
        Mobile,
        BedHeadTicketNumber ,
        ClinicId ,
        UniqueId  ,
        Name  ,
        DateOfBirth  ,
        ParentId ,
        Guid   ,
        Address ,
        Id
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        StringValue({ fieldName: "NIC", value: NIC }),
        StringValue({ fieldName: "Passport", value: Passport }),
        StringValue({ fieldName: "Mobile", value: Mobile }),
        StringValue({ fieldName: "BedHeadTicketNumber", value: BedHeadTicketNumber }),
        StringValue({ fieldName: "ClinicId", value: ClinicId }),
        StringValue({ fieldName: "UniqueId", value: UniqueId }),
        StringValue({ fieldName: "Name", value: Name }),
        DateString({ fieldName: "DateOfBirth", value: DateOfBirth }),
        EntityId({ fieldName: "ParentId", value: ParentId }),
        EntityId({ fieldName: "Guid", value: Guid }),
        StringValue({ fieldName: "Address", value: Address }),
        EntityId({ fieldName: "Id", value: Id}),
      ];

      let patientGetResult = await executeSp({
        spName: `PatientGet`,
        params: params,
        connection,
      });

      patientGetResult = patientGetResult.recordsets;

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

      patientNewSurgeryGetResult = patientNewSurgeryGetResult.recordsets;

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
      const { 
        Id, 
        PatientId, 
        Surgeries,
        Status,
        UserSaved
      } = request.body;

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

      patientNewSurgerySaveResult = patientNewSurgerySaveResult.recordsets;

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

      patientOtherAllergyGetResult = patientOtherAllergyGetResult.recordsets;

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
      const { 
        Id, 
        PatientId, 
        Allergies,
        Status,
        UserSaved
      } = request.body;

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

      patientOtherAllergySaveResult = patientOtherAllergySaveResult.recordsets;

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

      patientOtherDiseasesGetResult = patientOtherDiseasesGetResult.recordsets;

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
      const { 
        Id, 
        PatientId, 
        Diseases,
        Status,
        UserSaved
      } = request.body;

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

      patientOtherDiseasesSaveResult = patientOtherDiseasesSaveResult.recordsets;

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

};

export default PatientController;
