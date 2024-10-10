import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  DateString,
  StringValue,
  SignedInteger,
} from "../../../utils/type-def.js";

const PrescriptionController = {
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
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        DateString({ fieldName: "DateFrom", value: DateFrom }),
        DateString({ fieldName: "DateTo", value: DateTo }),
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
        "success",
        "Data retrived successfully",
        prescriptionGetResult
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
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        DateString({ fieldName: "DateFrom", value: DateFrom }),
        DateString({ fieldName: "DateTo", value: DateTo }),
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
        "success",
        "Data retrived successfully",
        prescriptionRecordDiseaseCountGetResult
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
   * get prescription record disease details
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  // async getPrescriptionRecords(request, response, next) {
  //   const errors = validationResult(request);
  //   if (!errors.isEmpty()) {
  //     return response.status(422).json({
  //       error: true,
  //       message: ResponseMessage.Prescription.VALIDATION_ERROR,
  //       data: errors,
  //     });
  //   }

  //   try {
  //     let connection = request.app.locals.db;
  //     const { UserId, DoctorId, DateFrom, DateTo } = request.body;

  //     var params = [
  //       EntityId({ fieldName: "UserId", value: UserId }),
  //       EntityId({ fieldName: "DoctorId", value: DoctorId }),
  //       DateString({ fieldName: "DateFrom", value: DateFrom }),
  //       DateString({ fieldName: "DateTo", value: DateTo }),
  //     ];

  //     let prescriptionRecordsGetResult = await executeSp({
  //       spName: `PrescriptionRecordGet`,
  //       params: params,
  //       connection,
  //     });

  //     prescriptionRecordsGetResult = prescriptionRecordsGetResult.recordsets[0];

  //     handleResponse(
  //       response,
  //       200,
  //       "success",
  //       "Data retrived successfully",
  //       prescriptionRecordsGetResult
  //     );
  //   } catch (error) {
  //     handleError(
  //       response,
  //       500,
  //       "error",
  //       error.message,
  //       "Something went wrong"
  //     );
  //     next(error);
  //   }
  // },

  async getPrescriptionRecords(request, response, next) {
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
        UserId,
        SessionId,
        AppointmentId,
        PrescriptionId,
        PatientId = 0,
        Id,
        FromDate,
        ToDate,
        DoctorId,
        SearchType,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "FromDate", value: FromDate }),
        StringValue({ fieldName: "ToDate", value: ToDate }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        StringValue({ fieldName: "SearchType", value: SearchType }),
      ];

      let prescriptionRecordDiseaseDetailsGetResult = await executeSp({
        spName: `PrescriptionRecordGet`,
        params: params,
        connection,
      });

      prescriptionRecordDiseaseDetailsGetResult =
        prescriptionRecordDiseaseDetailsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        prescriptionRecordDiseaseDetailsGetResult
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

  async savePrescriptionRecord(request, response, next) {
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
        AgeMonths,
        AgeYears,
        AppointmentId,
        AppointmentNumber,
        AppointmentSessionId,
        AppointmentStatus,
        BloodPressureDiastolic,
        BloodPressureSystolic,
        Diagnosis,
        Disposition,
        DispositionSave,
        Doctor,
        FollowUp,
        Height,
        IllnessData,
        NegativeSx,
        NextVisitDate,
        Note,
        Patient,
        PatientDisposition,
        PositiveSx,
        PrescriptionId,
        PulseRate,
        RecordDrugs,
        RedFlag,
        SendEmail,
        SendSms,
        Status,
        Temperature,
        UserId,
        Weight,
        Test,
        DispositionFollowUp,
        DispositionNote,
        DispositionId,
      } = request.body;

      var params = [
        SignedInteger({ fieldName: "AgeMonths", value: AgeMonths }),
        SignedInteger({ fieldName: "AgeYears", value: AgeYears }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "AppointmentNumber", value: AppointmentNumber }),
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "FromDate", value: FromDate }),
        StringValue({ fieldName: "ToDate", value: ToDate }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        StringValue({ fieldName: "SearchType", value: SearchType }),
      ];

      let prescriptionRecordDiseaseDetailsGetResult = await executeSp({
        spName: `PrescriptionRecordGet`,
        params: params,
        connection,
      });

      prescriptionRecordDiseaseDetailsGetResult =
        prescriptionRecordDiseaseDetailsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        prescriptionRecordDiseaseDetailsGetResult
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

  async prescriptionTemplateGet(request, response, next) {
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
      const { UserId, Id } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let prescriptionRecordDiseaseDetailsGetResult = await executeSp({
        spName: `PrescriptionTemplateGet`,
        params: params,
        connection,
      });

      prescriptionRecordDiseaseDetailsGetResult =
        prescriptionRecordDiseaseDetailsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        prescriptionRecordDiseaseDetailsGetResult
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
      const { UserId, Id } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let prescriptionRecordDrugCountGetResult = await executeSp({
        spName: `PrescriptionTemplateGet`,
        params: params,
        connection,
      });

      prescriptionRecordDrugCountGetResult =
        prescriptionRecordDrugCountGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        prescriptionRecordDrugCountGetResult
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

export default PrescriptionController;
