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
import { deHashPatientId } from "../../../utils/id-hashing.js";
import sql from "mssql";

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
      } = request.body;

      const DrugsTable = new sql.Table();
      DrugsTable.columns.add("Id", sql.Int);
      DrugsTable.columns.add("DrugId", sql.Int);
      DrugsTable.columns.add("Frequency", sql.NVarChar(50));
      DrugsTable.columns.add("Duration", sql.NVarChar(20));
      DrugsTable.columns.add("Quantity", sql.Float);
      DrugsTable.columns.add("Weight", sql.NVarChar(10));
      DrugsTable.columns.add("WeightType", sql.NVarChar(100));
      DrugsTable.columns.add("Description", sql.NVarChar(sql.MAX));
      DrugsTable.columns.add("Status", sql.TinyInt);

      if (Array.isArray(RecordDrugs) && RecordDrugs.length > 0) {
        RecordDrugs.forEach((data) => {
          DrugsTable.rows.add(
            data.Id,
            data.DrugId,
            data.Frequency,
            data.Duration,
            data.Quentity,
            data.Weight,
            "",
            data.Description,
            data.Status
          );
        });
      }

      var params = [
        SignedInteger({ fieldName: "AgeMonths", value: AgeMonths }),
        SignedInteger({ fieldName: "AgeYears", value: AgeYears }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),

        SignedInteger({
          fieldName: "AppointmentNumber",
          value: AppointmentNumber,
        }),

        EntityId({
          fieldName: "AppointmentSessionId",
          value: AppointmentSessionId,
        }),
        SignedInteger({
          fieldName: "AppointmentStatus",
          value: AppointmentStatus,
        }),
        StringValue({
          fieldName: "BloodPressureDiastolic",
          value: BloodPressureDiastolic,
        }),
        StringValue({
          fieldName: "BloodPressureSystolic",
          value: BloodPressureSystolic,
        }),
        StringValue({ fieldName: "Diagnosis", value: Diagnosis }),
        StringValue({ fieldName: "FollowUp", value: FollowUp }),
        StringValue({ fieldName: "Height", value: Height }),
        StringValue({ fieldName: "IllnessData", value: IllnessData }),
        EntityId({ fieldName: "Doctor", value: Doctor }),
        StringValue({ fieldName: "NegativeSx", value: NegativeSx }),
        StringValue({ fieldName: "NextVisitDate", value: NextVisitDate }),
        StringValue({ fieldName: "Note", value: Note }),
        StringValue({ fieldName: "PositiveSx", value: PositiveSx }),
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        StringValue({ fieldName: "PulseRate", value: PulseRate }),
        StringValue({
          fieldName: "DispositionNote",
          value: Disposition?.Note,
        }),
        StringValue({
          fieldName: "DispositionFollowUp",
          value: Disposition?.FollowUp,
        }),

        StringValue({ fieldName: "RedFlag", value: RedFlag }),
        SignedInteger({ fieldName: "Status", value: Status }),
        StringValue({ fieldName: "Test", value: Test }),
        EntityId({ fieldName: "UserId", value: UserId }),
        StringValue({ fieldName: "Temperature", value: Temperature }),
        StringValue({ fieldName: "Weight", value: Weight }),
        EntityId({
          fieldName: "PatientId",
          value: deHashPatientId({ patientId: Patient.Id }),
        }),
        EntityId({ fieldName: "Id", value: PrescriptionId }),
        {
          name: "PrescriptionRecordDrugs",
          type: sql.TVP("PrescriptionRecordDrug"),
          value: DrugsTable,
        },
        {
          name: "DispositionSave",
          type: sql.TYPES.Bit,
          value: DispositionSave,
        },
      ];

      let prescriptionRecordDiseaseDetailsGetResult = await executeSp({
        spName: `PrescriptionRecordSave`,
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
