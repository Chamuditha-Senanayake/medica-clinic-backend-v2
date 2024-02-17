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

};

export default MedicalCertificateController;
