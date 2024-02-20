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

const MedicalCertificateController = {
  /**
   *
   * get medical certificate
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getMedicalCertificate(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.MedicalCertificate.VALIDATION_ERROR,
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

      let medicalCertificateGetResult = await executeSp({
        spName: `MedicalCertificateGet`,
        params: params,
        connection,
      });

      medicalCertificateGetResult = medicalCertificateGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        medicalCertificateGetResult
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
   * save medical certificate
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async saveMedicalCertificate(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.MedicalCertificate.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { 
        PrescriptionId,
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
        ResidentialAddress,
        Employment,
        NatureOfDiesease,
        RecommendedDays,
        LeaveWithEffectFrom,
        Remark,
        IssuingDate,
        Status,
        UserSaved,
        Id
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

        StringValue({ fieldName: "PatientBloodGroup", value: PatientBloodGroup }),

        SignedInteger({
          fieldName: "PatientStatus",
          value: PatientStatus,
        }),
        StringValue({ fieldName: "ResidentialAddress", value: ResidentialAddress }),
        StringValue({ fieldName: "Employment", value: Employment }),
        StringValue({ fieldName: "NatureOfDiesease", value: NatureOfDiesease }),
        EntityId({ fieldName: "RecommendedDays", value: RecommendedDays }),

        DateString({ fieldName: "LeaveWithEffectFrom", value: LeaveWithEffectFrom }),
        StringValue({ fieldName: "Remark", value: Remark }),
        DateString({ fieldName: "IssuingDate", value: IssuingDate }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let medicalCertificateSaveResult = await executeSp({
        spName: `MedicalCertificateSave`,
        params: params,
        connection,
      });

      medicalCertificateSaveResult = medicalCertificateSaveResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        medicalCertificateSaveResult
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

export default MedicalCertificateController;
