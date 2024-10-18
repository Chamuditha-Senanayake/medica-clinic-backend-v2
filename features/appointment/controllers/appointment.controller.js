import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString,
} from "../../../utils/type-def.js";

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
      let connection = request.app.locals.db;
      const { UserId, Id, Number, SessionId, PatientId, PatientMobile } =
        request.body;

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

      appointmentGetResult = appointmentGetResult.recordsets[0];

      if (Array.isArray(appointmentGetResult)) {
        appointmentGetResult.forEach((appointment) => {
          if (
            Array.isArray(appointment?.PatientId) &&
            appointment?.PatientId.length === 2
          ) {
            appointment.PatientId = appointment.PatientId[0];
          }
        });
      }
      handleResponse(
        response,
        200,
        "success",
        "Appointment data retrieved successfully",
        appointmentGetResult
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
   * save appointment
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */

  async saveAppointment(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Appointment.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Number,
        SessionId,
        PatientId,
        Status,
        UserSaved,
        Id = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Number", value: Number }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({
          fieldName: "UserSaved",
          value: UserSaved,
        }),
        EntityId({
          fieldName: "Id",
          value: Id,
        }),
      ];

      let AppointmentSaveResult = await executeSp({
        spName: `AppointmentSave`,
        params: params,
        connection,
      });

      AppointmentSaveResult = AppointmentSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Appointment saved successfully",
        AppointmentSaveResult
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
   * get next appointments
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */

  async appointmentGetNext(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Appointment.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, SessionId } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "SessionId", value: SessionId }),
      ];

      let AppointmentGetNextResult = await executeSp({
        spName: `AppointmentGetNext`,
        params: params,
        connection,
      });

      AppointmentGetNextResult = AppointmentGetNextResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        AppointmentGetNextResult
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
   * @param {request} request  object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async appointmentReport(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Appointment.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, FromDate, ToDate, DoctorId, BranchId } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        DateString({ fieldName: "FromDate", value: FromDate }),
        DateString({ fieldName: "ToDate", value: ToDate }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "BranchId", value: BranchId }),
      ];

      let appointmentReportResult = await executeSp({
        spName: `AppointmentReport`,
        params: params,
        connection,
      });

      appointmentReportResult = appointmentReportResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Appointment Report retrieved successfully",
        appointmentReportResult
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

  async deleteAppointment(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Appointment.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { AppoinmentId } = request.body;

      var params = [
        EntityId({ fieldName: "AppoinmentId", value: AppoinmentId }),
      ];

      let appointmentDeleteResult = await executeSp({
        spName: `AppointmentDelete`,
        params: params,
        connection,
      });

      appointmentDeleteResult = appointmentDeleteResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Appointment deleted successfully",
        appointmentDeleteResult
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

export default AppointmentController;
