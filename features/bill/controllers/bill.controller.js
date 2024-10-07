import { validationResult } from "express-validator";
import sql from "mssql";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  DateString,
  DecimalValue,
  EntityId,
  SignedInteger,
  StringValue,
  TableValueParameters,
  UnsignedInteger,
} from "../../../utils/type-def.js";

const BillController = {
  /**
   *
   * Save bills
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */

  async saveBill(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Bill.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id = 0,
        SessionId = 0,
        DoctorId = 0,
        PatientId = 0,
        AppointmentId = 0,
        AppointmentNumber = 0,
        Total = 0,
        Discount = 0,
        BillData,
        UserId = 0,
      } = request.body;

      const BillDataList = [];
      BillData.forEach((BillData) => {
        BillDataList.push([
          BillData.Amount,
          BillData.FeeType,
          BillData.ItemName,
        ]);
      });

      var params = [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "SessionId",
          type: sql.TYPES.Int,
          value: SessionId,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: PatientId,
        },
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: AppointmentId,
        },
        {
          name: "AppointmentNumber",
          type: sql.TYPES.Int,
          value: AppointmentNumber,
        },
        {
          name: "Total",
          type: sql.TYPES.Float,
          value: Total,
        },
        {
          name: "Discount",
          type: sql.TYPES.Float,
          value: Discount,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
        TableValueParameters({
          tableName: "BillDataSet",
          columns: [
            { columnName: "Amount", type: sql.VarChar(15) },
            { columnName: "FeeType", type: sql.VarChar(20) },
            { columnName: "ItemName", type: sql.VarChar(15) },
          ],
          values: BillDataList,
        }),
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

  /**
   *
   * Get medical bills
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */

  async getMedicalBills(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Bill.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        UserId,
        SessionId = 0,
        AppointmentId = 0,
        PatientId = 0,
        Id = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),

        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let medicalBillGetResult = await executeSp({
        spName: `MedicalBillGet`,
        params: params,
        connection,
      });

      medicalBillGetResult = medicalBillGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Bill data retrieved successfully",
        medicalBillGetResult
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
   * Get medical bill results
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getMedicalBillResults(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Bill.VALIDATION_ERROR,
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
        PatientTitle = "",
        PatientFirstName = "",
        PatientMiddleName = "",
        PatientLastName = "",
        PatientNIC = "",
        PatientPassport = "",
        PatientMobile = "",
        PatientEmail = "",
        PatientDateOfBirth,
        PatientGender = "",
        PatientParentId = 0,
        PatientPatientTypeId = 0,
        PatientBloodGroup = "",
        PatientInvalidOTPAttempts = 0,
        PatientStatus = 0,
        HomeAddress,
        OfficeAddress,
        ChargesForDrugs = 0,
        ChargesForDoctor = 0,
        ChargesForInvestigations = 0,
        ChargesForOther = 0,
        IssuingDate,
        Status,
        UserSaved,
        Id = 0,
      } = request.body;
      var params = [
        EntityId({ fieldName: "PrescriptionId", value: PrescriptionId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "AppointmentNumber", value: AppointmentNumber }),
        EntityId({
          fieldName: "AppointmentSessionId",
          value: AppointmentSessionId,
        }),
        SignedInteger({
          fieldName: "AppointmentStatus",
          value: AppointmentStatus,
        }),
        EntityId({ fieldName: "PatientId", value: PatientId }),

        StringValue({ fieldName: "PatientTitle", value: PatientTitle }),
        StringValue({ fieldName: "PatientFirstName", value: PatientFirstName }),
        StringValue({
          fieldName: "PatientMiddleName",
          value: PatientMiddleName,
        }),
        StringValue({ fieldName: "PatientLastName", value: PatientLastName }),
        StringValue({ fieldName: "PatientNIC", value: PatientNIC }),
        StringValue({ fieldName: "PatientPassport", value: PatientPassport }),
        StringValue({ fieldName: "PatientMobile", value: PatientMobile }),
        StringValue({ fieldName: "PatientEmail", value: PatientEmail }),

        DateString({
          fieldName: "PatientDateOfBirth",
          value: PatientDateOfBirth,
        }),
        StringValue({ fieldName: "PatientGender", value: PatientGender }),

        EntityId({ fieldName: "PatientParentId", value: PatientParentId }),
        EntityId({
          fieldName: "PatientPatientTypeId",
          value: PatientPatientTypeId,
        }),
        StringValue({
          fieldName: "PatientBloodGroup",
          value: PatientBloodGroup,
        }),

        EntityId({
          fieldName: "PatientInvalidOTPAttempts",
          value: PatientInvalidOTPAttempts,
        }),

        SignedInteger({
          fieldName: "PatientStatus",
          value: PatientStatus,
        }),
        StringValue({ fieldName: "HomeAddress", value: HomeAddress }),
        StringValue({ fieldName: "OfficeAddress", value: OfficeAddress }),
        DecimalValue({ fieldName: "ChargesForDrugs", value: ChargesForDrugs }),
        DecimalValue({
          fieldName: "ChargesForDoctor",
          value: ChargesForDoctor,
        }),
        DecimalValue({
          fieldName: "ChargesForInvestigations",
          value: ChargesForInvestigations,
        }),
        DecimalValue({ fieldName: "ChargesForOther", value: ChargesForOther }),
        DateString({ fieldName: "IssuingDate", value: IssuingDate }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let medicalBillSaveResult = await executeSp({
        spName: `MedicalBillSave`,
        params: params,
        connection,
      });

      medicalBillSaveResult = medicalBillSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Bill data retrived successfully",
        medicalBillSaveResult
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
