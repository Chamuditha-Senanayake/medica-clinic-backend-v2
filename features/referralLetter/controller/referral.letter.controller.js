import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { EntityId, StringValue } from "../../../utils/type-def.js";

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
};

export default ReferralLetterController;
