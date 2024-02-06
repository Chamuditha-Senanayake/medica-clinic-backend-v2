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
const AppointmentController = {
  /**
   *
   * get appointment by id
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getAppointment(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Appointment.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = req.app.locals.db;
      const {
        UserId,
        Id = 0,
        Number = 0,
        SessionId = 0,
        PatientId = 0,
        PatientMobile = "",
      } = req.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "Number", value: Number }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        StringValue({ fieldName: "PatientMobile", value: PatientMobile }),
      ];

      let appointmentGetResult = await executeSp({
        spName: `AppointmentGet`,
        params: params,
        connection,
      });

      appointmentGetResult = appointmentGetResult.recordsets;

      handleResponse(
        res,
        200,
        "success",
        "Appointment data retrieved successfully",
        appointmentGetResult
      );
    } catch (error) {
      handleError(res, 500, "error", error.message, "Something went wrong");
      next(error);
    }
  },
};

export default AppointmentController;
