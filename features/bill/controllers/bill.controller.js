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

const BillController = {
  async saveBill(request, response, next) {
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
      const {
        Id,
        SessionId = 0,
        DoctorId = 0,
        PatientId = 0,
        AppointmentId = 0,
        AppointmentNumber,
        Total,
        Discount,
        BillDataSet,
        UserSaved = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        StringValue({
          fieldName: "AppointmentNumber",
          value: AppointmentNumber,
        }),
        StringValue({ fieldName: "Total", value: Total }),
        StringValue({ fieldName: "Discount", value: Discount }),
        StringValue({ fieldName: "BillDataSet", value: BillDataSet }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let billSaveResult = await executeSp({
        spName: `BillSave`,
        params: params,
        connection,
      });

      billSaveResult = billSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Bill saved successfully",
        billSaveResult
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

export default BillController;
