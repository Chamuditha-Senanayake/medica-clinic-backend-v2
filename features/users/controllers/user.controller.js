import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  TableValueParameters,
  DateString,
} from "../../../utils/type-def.js";
import sql from "mssql";
const {
  Int,
  NVarChar,
  VarChar,
  TinyInt,
  Bit,
  Float,
  Decimal,
  Date,
  DateTime,
  Binary,
  TVP,
} = sql;

const UserController = {
  async getAddress(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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

      let addressGetResult = await executeSp({
        spName: `AddressGet`,
        params: params,
        connection,
      });

      addressGetResult = addressGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Bill data retrived successfully",
        addressGetResult
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

export default UserController;
