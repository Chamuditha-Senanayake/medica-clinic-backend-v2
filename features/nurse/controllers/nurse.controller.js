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

const NurseController = {
  /**
   *
   * get nurse by [Id, NurseUserId, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getNurse(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Nurse.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, NurseUserId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "NurseUserId", value: NurseUserId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let nurseGetResult = await executeSp({
        spName: `NurseGet`,
        params: params,
        connection,
      });

      nurseGetResult = nurseGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Nurse data retrived successfully",
        nurseGetResult
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

export default NurseController;
