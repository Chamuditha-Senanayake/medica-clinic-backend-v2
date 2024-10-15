import { validationResult } from "express-validator";
import sql from "mssql";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { deHashPatientId } from "../../../utils/id-hashing.js";
import {
  DateString,
  EntityId,
  FloatValue,
  SignedInteger,
  StringValue,
  TableValueParameters,
} from "../../../utils/type-def.js";
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
      if (
        Array.isArray(
          doctorGetResult.recordsets[0] &&
            doctorGetResult.recordsets.length === 1
        )
      ) {
        doctorGetResult = doctorGetResult.recordsets[0][0];
      } else {
        doctorGetResult = doctorGetResult.recordsets[0];
      }

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
   * get doctor by [Id, DoctorUserId, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDoctorByUserId(request, response, next) {
    console.log(request.body);
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
      console.log(UserId);

      // convert the request body value into a type
      var params = [
        EntityId({ fieldName: "Id", value: 0 }),
        EntityId({ fieldName: "DoctorUserId", value: UserId }),
        EntityId({ fieldName: "UserId", value: 0 }),
      ];

      // executes the given stored procedure
      let doctorGetResult = await executeSp({
        spName: `DoctorGet`,
        params: params,
        connection,
      });

      doctorGetResult = doctorGetResult.recordsets[0][0];

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
   * @param {next} next middleware
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
        BranchId,
        DoctorFee = 0,
        HospitalFee = 0,
        OtherFee = 0,
      } = request.body;

      const ContactNumberList = [];
      ContactNumbers.forEach((phoneNumber) => {
        ContactNumberList.push([null, phoneNumber, 1]);
      });

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
        StringValue({
          fieldName: "RegistrationNumber",
          value: RegistrationNumber,
        }),
        StringValue({ fieldName: "DateOfBirth", value: DateOfBirth }),
        StringValue({ fieldName: "Title", value: Title }),
        StringValue({ fieldName: "ZoomEmail", value: ZoomEmail }),
        ZoomPassword
          ? StringValue({
              fieldName: "ZoomPassword",
              value: ZoomPassword,
            })
          : null,
        EntityId({ fieldName: "BranchId", value: BranchId }),
        FloatValue({ fieldName: "DoctorFee", value: parseFloat(DoctorFee) }),
        FloatValue({
          fieldName: "HospitalFee",
          value: parseFloat(HospitalFee),
        }),
        FloatValue({ fieldName: "OtherFee", value: parseFloat(OtherFee) }),

        TableValueParameters({
          tableName: "ContactNumbers",
          columns: [
            { columnName: "Id", type: sql.Int },
            { columnName: "Number", type: sql.VarChar(15) },
            { columnName: "Status", type: sql.TinyInt },
          ],
          values: ContactNumberList,
        }),
      ];

      let doctorSaveResult = await executeSp({
        spName: `DoctorSave`,
        params: params,
        connection,
      });

      console.log(doctorSaveResult.recordsets);
      doctorSaveResult = doctorSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
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
   * @param {next} next middleware
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
        doctorSpecializationsGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
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
   * @param {next} next middleware
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

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
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
   * @param {next} next middleware
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
   * @param {next} next middleware
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
        SessionId = 0,
        PatientId = 0,
        AppointmentId,
        UserId,
        Id = 0,
        DoctorStatus = "",
        ChanalingStatus = "",
      } = request.body;

      var params = [
        {
          name: "SessionId",
          type: sql.TYPES.Int,
          value: SessionId,
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
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserId,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "DoctorStatus",
          type: sql.TYPES.NVarChar(255),
          value: DoctorStatus,
        },
        {
          name: "ChanalingStatus",
          type: sql.TYPES.NVarChar(255),
          value: ChanalingStatus,
        },
      ];

      let doctorChannelingStatusSaveResult = await executeSp({
        spName: `DoctorChannelingStatusSave`,
        params: params,
        connection,
      });

      doctorChannelingStatusSaveResult =
        doctorChannelingStatusSaveResult.recordsets;

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
   * @param {next} next middleware
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

      doctorContactNumberGetResult = doctorContactNumberGetResult.recordsets[0];

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
   * @param {next} next middleware
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
        EntityId({
          fieldName: "PatientId",
          value: deHashPatientId({ patientId: PatientId }),
        }),
      ];

      let doctorDispositionReminderGetResult = await executeSp({
        spName: `DoctorDispositionReminderGet`,
        params: params,
        connection,
      });

      doctorDispositionReminderGetResult =
        doctorDispositionReminderGetResult.recordsets[0];

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

  /**
   *
   * Save doctor disposition reminder
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */

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
        Id,
        PrescriptionRecordId,
        AppointmentId,
        PatientId,
        RemindOn = 0,
        RemindFromDate = "",
        RemindType = "",
        Message = "",
        Status = 0,
        UserSaved,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({
          fieldName: "PrescriptionRecordId",
          value: PrescriptionRecordId,
        }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        EntityId({
          fieldName: "PatientId",
          value: deHashPatientId({ patientId: PatientId }),
        }),
        SignedInteger({
          fieldName: "RemindOn",
          value: RemindOn,
        }),
        StringValue({ fieldName: "RemindFromDate", value: RemindFromDate }),
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
        doctorDispositionReminderSaveResult.recordsets[0][0];

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
