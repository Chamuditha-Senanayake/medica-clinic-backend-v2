import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  SignedInteger,
  StringValue,
} from "../../../utils/type-def.js";

const ReferralLetterController = {
  /**
   *
   * get medical certificate
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getReferralLetterTemplate(request, response, next) {
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
      const { TypeId, UserId, Id, Name } = request.body;

      var params = [
        EntityId({ fieldName: "TypeId", value: TypeId }),
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "Name", value: Name }),
      ];

      let referralLetterTemplateGetResult = await executeSp({
        spName: `TemplateGet`,
        params: params,
        connection,
      });

      referralLetterTemplateGetResult =
        referralLetterTemplateGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        referralLetterTemplateGetResult
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

  async saveReferralLetter(request, response, next) {
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
        Id,
        AppointmentId,
        AppointmentNumber,
        AppointmentSessionId,
        AppointmentStatus = 1,
        IssuingDate,
        Message,
        PatientBloodGroup,
        PatientDateOfBirth,
        PatientFirstName,
        PatientId,
        PatientLastName,
        PatientMiddleName,
        PatientMobile,
        PatientNIC,
        PatientPassport,
        PatientPatientTypeId,
        PatientStatus,
        PrescriptionId,
        ReferringDoctor,
        Status,
        UserId,
      } = request.body;

      var params = [
        SignedInteger({
          fieldName: "AppointmentNumber",
          value: parseInt(AppointmentNumber),
        }),
        SignedInteger({
          fieldName: "AppointmentStatus",
          value: AppointmentStatus,
        }),
        EntityId({
          fieldName: "AppointmentId",
          value: AppointmentId,
        }),
        EntityId({
          fieldName: "AppointmentSessionId",
          value: AppointmentSessionId,
        }),
        StringValue({ fieldName: "IssuingDate", value: IssuingDate }),
        StringValue({ fieldName: "Message", value: Message }),
        StringValue({
          fieldName: "PatientBloodGroup",
          value: PatientBloodGroup,
        }),
        StringValue({
          fieldName: "PatientDateOfBirth",
          value: PatientDateOfBirth,
        }),
        StringValue({
          fieldName: "PatientFirstName",
          value: PatientFirstName,
        }),
        StringValue({
          fieldName: "PatientId",
          value: PatientId,
        }),
        StringValue({
          fieldName: "PatientLastName",
          value: PatientLastName,
        }),
        StringValue({
          fieldName: "PatientMiddleName",
          value: PatientMiddleName,
        }),
        StringValue({
          fieldName: "PatientMobile",
          value: PatientMobile,
        }),
        StringValue({
          fieldName: "PatientNIC",
          value: PatientNIC,
        }),
        StringValue({
          fieldName: "PatientPassport",
          value: PatientPassport,
        }),
        EntityId({
          fieldName: "PatientPatientTypeId",
          value: PatientPatientTypeId,
        }),
        SignedInteger({
          fieldName: "PatientStatus",
          value: PatientStatus,
        }),
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        StringValue({
          fieldName: "ReferringDoctor",
          value: ReferringDoctor,
        }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let referralLetterTemplateGetResult = await executeSp({
        spName: `ReferralLetterSave`,
        params: params,
        connection,
      });

      referralLetterTemplateGetResult =
        referralLetterTemplateGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        referralLetterTemplateGetResult
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

export default ReferralLetterController;
