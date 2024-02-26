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

const AnalyticsController = {
  /**
   *
   * get medical analytics
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getMedicalAnalytics(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Analytics.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { 
        UserId,
        SessionId,
        AppointmentId,
        DoctorId,
        PatientId,
        Id,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "Id", value: Id }),
    ];

      let medicalAnalyticsGetResult = await executeSp({
        spName: `MedicalAnalyticsGet`,
        params: params,
        connection,
      });

      medicalAnalyticsGetResult = medicalAnalyticsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        medicalAnalyticsGetResult
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
   * save medical analytics
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async saveMedicalAnalytics(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Analytics.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { 
        PrescriptionId,
        AppointmentId,
        AppointmentNumber,
        AppointmentSessionId ,
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
        Weight,
        Height,
        BloodPressureSystolic,
        BloodPressureDiastolic,
        Temperature,
        PulseRate,
        SE,
        CholesterolHDL,
        Cholesterol,
        CholesterolLDL,
        WaistCircumference,
        HbA1c,
        UMicroAlbumin,
        UrineProtein24,
        HrPPG2,
        FastingBloodSugar,
        Creatinine,
        UFR,
        Tg,
        Hb,
        LipidProfile,
        FPG,
        TC,
        RPG,
        Urea,
        FCB,
        UrineCulture,
        TCHDL,
        Dengue,
        VLDL,
        Stools,
        Hepatitis,
        Status,
        UserSaved,
        Id,
      } = request.body;

      var params = [
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "AppointmentNumber", value: AppointmentNumber }),
        EntityId({ fieldName: "AppointmentSessionId", value: AppointmentSessionId }),

        SignedInteger({
          fieldName: "AppointmentStatus",
          value: AppointmentStatus,
        }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        
        StringValue({ fieldName: "PatientTitle", value: PatientTitle }),
        StringValue({ fieldName: "PatientFirstName", value: PatientFirstName }),
        StringValue({ fieldName: "PatientMiddleName", value: PatientMiddleName }),
        StringValue({ fieldName: "PatientLastName", value: PatientLastName }),
        StringValue({ fieldName: "PatientNIC", value: PatientNIC }),
        StringValue({ fieldName: "PatientPassport", value: PatientPassport }),
        StringValue({ fieldName: "PatientMobile", value: PatientMobile }),
        StringValue({ fieldName: "PatientEmail", value: PatientEmail }),
        DateString({ fieldName: "PatientDateOfBirth", value: PatientDateOfBirth }),
        StringValue({ fieldName: "PatientGender", value: PatientGender }),

        EntityId({ fieldName: "PatientParentId", value: PatientParentId }),
        EntityId({ fieldName: "PatientPatientTypeId", value: PatientPatientTypeId }),
        EntityId({ fieldName: "PatientBloodGroup", value: PatientBloodGroup }),
        SignedInteger({
          fieldName: "PatientStatus",
          value: PatientStatus,
        }),

        StringValue({ fieldName: "Weight", value: Weight }),
        StringValue({ fieldName: "Height", value: Height }),
        StringValue({ fieldName: "BloodPressureSystolic", value: BloodPressureSystolic }),
        StringValue({ fieldName: "BloodPressureDiastolic", value: BloodPressureDiastolic }),
        StringValue({ fieldName: "Temperature", value: Temperature }),
        StringValue({ fieldName: "PulseRate", value: PulseRate }),
        StringValue({ fieldName: "SE", value: SE }),
        StringValue({ fieldName: "CholesterolHDL", value: CholesterolHDL }),
        StringValue({ fieldName: "Cholesterol", value: Cholesterol }),
        StringValue({ fieldName: "CholesterolLDL", value: CholesterolLDL }),
        StringValue({ fieldName: "WaistCircumference", value: WaistCircumference }),
        StringValue({ fieldName: "HbA1c", value: HbA1c }),
        StringValue({ fieldName: "UMicroAlbumin", value: UMicroAlbumin }),
        StringValue({ fieldName: "UrineProtein24", value: UrineProtein24 }),
        StringValue({ fieldName: "HrPPG2", value: HrPPG2 }),
        StringValue({ fieldName: "FastingBloodSugar", value: FastingBloodSugar }),
        StringValue({ fieldName: "Creatinine", value: Creatinine }),
        StringValue({ fieldName: "UFR", value: UFR }),
        StringValue({ fieldName: "Tg", value: Tg }),
        StringValue({ fieldName: "Hb", value: Hb }),
        StringValue({ fieldName: "LipidProfile", value: LipidProfile }),
        StringValue({ fieldName: "FPG", value: FPG }),
        StringValue({ fieldName: "TC", value: TC }),
        StringValue({ fieldName: "RPG", value: RPG }),
        StringValue({ fieldName: "Urea", value: Urea }),
        StringValue({ fieldName: "FCB", value: FCB }),
        StringValue({ fieldName: "UrineCulture", value: UrineCulture }),
        StringValue({ fieldName: "TCHDL", value: TCHDL }),
        StringValue({ fieldName: "Dengue", value: Dengue }),
        StringValue({ fieldName: "VLDL", value: VLDL }),
        StringValue({ fieldName: "Stools", value: Stools }),
        StringValue({ fieldName: "Hepatitis", value: Hepatitis }),
        
        EntityId({ fieldName: "Status", value: Status }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let medicalAnalyticsSaveResult = await executeSp({
        spName: `MedicalAnalyticsSave`,
        params: params,
        connection,
      });

      medicalAnalyticsSaveResult = medicalAnalyticsSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        medicalAnalyticsSaveResult
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

export default AnalyticsController;
