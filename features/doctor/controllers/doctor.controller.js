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

const DoctorController = {
  /**
   *
   * get doctor by [Id, DoctorUserId, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDoctor(request, response, next) {
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
      const { Id, DoctorUserId, UserId } = request.body;

      // convert the request body value into a type
      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "DoctorUserId", value: DoctorUserId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      // executes the given stored procedure
      let doctorGetResult = await executeSp({
        spName: `DoctorGet`,
        params: params,
        connection,
      });

      doctorGetResult = doctorGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Doctor data retrived successfully",
        doctorGetResult
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
   * save a doctor
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveDoctor(request, response, next) {
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
        FirstName,
        MiddleName,
        LastName,
        Email,
        NIC,
        Status,
        UserSaved = 0,
        ContactNumbers,
        RegistrationNumber,
        DateOfBirth,
        Title,
        ZoomEmail,
        ZoomPassword,
        Chargers,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "FirstName", value: FirstName }),
        StringValue({ fieldName: "MiddleName", value: MiddleName }),
        StringValue({ fieldName: "LastName", value: LastName }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "NIC", value: NIC }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        // TODO: Contact numbers is an array of objects
        // StringValue({ fieldName: "ContactNumbers", value: ContactNumbers }),
        TableValueParameters({
          tableName: "ContactNumbers",
          columns: [
            {
              columnName: "Id",
              type: Int,
              options: { nullable: true },
            },
            {
              columnName: "Number",
              type: NVarChar,
              options: null,
            },
            {
              columnName: "Status",
              type: TinyInt,
              options: null,
            },
          ],
          values: ContactNumbers,
        }),
        StringValue({
          fieldName: "RegistrationNumber",
          value: RegistrationNumber,
        }),
        DateString({ fieldName: "DateOfBirth", value: DateOfBirth }),
        StringValue({ fieldName: "Title", value: Title }),
        StringValue({ fieldName: "ZoomEmail", value: ZoomEmail }),
        ZoomPassword
          ? StringValue({
              fieldName: "ZoomPassword",
              value: ZoomPassword,
            })
          : null,
        StringValue({ fieldName: "Chargers", value: Chargers }),
      ];

      let doctorSaveResult = await executeSp({
        spName: `DoctorSave`,
        params: params,
        connection,
      });

      console.log(doctorSaveResult.recordsets);
      doctorSaveResult = doctorSaveResult.recordsets;

      //handle no data
      // if (doctorSaveResult[0].length == 0) {
      //   handleResponse(response, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorSaveResult[0][0];
      // const billData = doctorSaveResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Bill data retrieved successfully",
        doctorSaveResult
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
   * get the doctor's specializations
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async getDoctorSpecializations(request, response, next) {
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
      const { DoctorId = 0, Id = 0 } = request.body;
      var params = [
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let doctorSpecializationsGetResult = await executeSp({
        spName: `DoctorSpecializationsGet`,
        params: params,
        connection,
      });

      console.log(doctorSpecializationsGetResult.recordsets);
      doctorSpecializationsGetResult =
        doctorSpecializationsGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Bill data retrived successfully",
        doctorSpecializationsGetResult
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
   * save a specialization for a doctor
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveDoctorSpecialization(request, response, next) {
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
        DoctorId,
        SpecializationId,
        Status,
        UserSaved,
        Id = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "SpecializationId", value: SpecializationId }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let doctorSpecializationsSaveResult = await executeSp({
        spName: `DoctorSpecializationsSave`,
        params: params,
        connection,
      });

      console.log(doctorSpecializationsSaveResult.recordsets);
      doctorSpecializationsSaveResult =
        doctorSpecializationsSaveResult.recordsets;

      //handle no data
      // if (doctorSpecializationsSaveResult[0].length == 0) {
      //   handleResponse(response, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorSpecializationsSaveResult[0][0];
      // const billData = doctorSpecializationsSaveResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Bill data retrived successfully",
        doctorSpecializationsSaveResult
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
   * get the channeling status of a doctor
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   */
  async DoctorChannelingStatusGet(request, response, next) {
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
        UserId = 0,
        Id = 0,
        AppointmentId = 0,
        SessionId = 0,
        PatientId = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
      ];

      let doctorChannelingStatusGetResult = await executeSp({
        spName: `DoctorChannelingStatusGet`,
        params: params,
        connection,
      });

      doctorChannelingStatusGetResult =
        doctorChannelingStatusGetResult.recordsets;

      //handle no data
      // if (doctorChannelingStatusGetResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorChannelingStatusGetResult[0][0];
      // const billData = doctorChannelingStatusGetResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Channeling data retrieved successfully",
        doctorChannelingStatusGetResult
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
   * save/update channeling status
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async DoctorChannelingStatusSave(request, response, next) {
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
        SessionId,
        PatientId,
        AppointmentId,
        UserSaved,
        Id = 0,
        DoctorStatus = "",
        ChanalingStatus = "",
      } = request.body;

      var params = [
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "DoctorStatus", value: DoctorStatus }),
        StringValue({ fieldName: "ChanalingStatus", value: ChanalingStatus }),
      ];

      let doctorChannelingStatusSaveResult = await executeSp({
        spName: `DoctorChannelingStatusSave`,
        params: params,
        connection,
      });

      doctorChannelingStatusSaveResult =
        doctorChannelingStatusSaveResult.recordsets;

      //handle no data
      // if (doctorChannelingStatusSaveResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorChannelingStatusSaveResult[0][0];
      // const billData = doctorChannelingStatusSaveResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Channeling status created successfully",
        doctorChannelingStatusSaveResult
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
   * Get the contact numbers of doctors
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async DoctorContactNumberGet(request, response, next) {
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
      const { Id = 0, DoctorId = 0, ContactNumber = "", UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        StringValue({ fieldName: "ContactNumber", value: ContactNumber }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let doctorContactNumberGetResult = await executeSp({
        spName: `DoctorContactNumberGet`,
        params: params,
        connection,
      });

      doctorContactNumberGetResult = doctorContactNumberGetResult.recordsets;

      //handle no data
      // if (doctorContactNumberGetResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorContactNumberGetResult[0][0];
      // const billData = doctorContactNumberGetResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Contact numbers retrieved successfully",
        doctorContactNumberGetResult
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
   * Get doctor disposition reminder
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async DoctorDispositionReminderGet(request, response, next) {
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
      const { UserId, PatientId } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
      ];

      let doctorDispositionReminderGetResult = await executeSp({
        spName: `DoctorDispositionReminderGet`,
        params: params,
        connection,
      });

      console.log(doctorDispositionReminderGetResult.recordsets);
      doctorDispositionReminderGetResult =
        doctorDispositionReminderGetResult.recordsets;

      //handle no data
      // if (doctorDispositionReminderGetResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorDispositionReminderGetResult[0][0];
      // const billData = doctorDispositionReminderGetResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        doctorDispositionReminderGetResult
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

  async DoctorDispositionReminderSave(request, response, next) {
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
        Id = 0,
        PrescriptionRecordId = 0,
        AppointmentId = 0,
        PatientId = 0,
        RemindOn = 0,
        RemindFromDate = "",
        RemindType = "",
        Message = "",
        Status = 0,
        UserSaved = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({
          fieldName: "PrescriptionRecordId",
          value: PrescriptionRecordId,
        }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        SignedInteger({
          fieldName: "RemindOn",
          value: RemindOn,
        }),
        DateString({ fieldName: "RemindFromDate", value: RemindFromDate }),
        StringValue({ fieldName: "RemindType", value: RemindType }),
        StringValue({ fieldName: "Message", value: Message }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
      ];

      let doctorDispositionReminderSaveResult = await executeSp({
        spName: `DoctorDispositionReminderSave`,
        params: params,
        connection,
      });

      doctorDispositionReminderSaveResult =
        doctorDispositionReminderSaveResult.recordsets;

      //handle no data
      // if (doctorDispositionReminderSaveResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorDispositionReminderSaveResult[0][0];
      // const billData = doctorDispositionReminderSaveResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        response,
        200,
        "success",
        "Reminder saved successfully",
        doctorDispositionReminderSaveResult
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

export default DoctorController;
