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

const NotificationScheduleController = {
  /**
   *
   * get disease by [Id, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getNotificationSchedule(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.NotificationSchedule.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;      

      var params = [];

      let notificationScheduleGetResult = await executeSp({
        spName: `NotificationScheduleGet`,
        params: params,
        connection,
      });

      notificationScheduleGetResult = notificationScheduleGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Notification schedule retrived successfully",
        notificationScheduleGetResult
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
   * save a disease
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async updateNotificationSchedule(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.NotificationSchedule.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Status,
        ScheduleId,
        MediumId,
      } = request.body;

    var params = [
      EntityId({ fieldName: "Status", value: Status }),
      EntityId({ fieldName: "ScheduleId", value: ScheduleId }),
      EntityId({ fieldName: "MediumId", value: MediumId }),
    ];

      let notificationScheduleUpdateResult = await executeSp({
        spName: `NotificationScheduleUpdate`,
        params: params,
        connection,
      });

      console.log(notificationScheduleUpdateResult.recordsets);
      notificationScheduleUpdateResult = notificationScheduleUpdateResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        notificationScheduleUpdateResult
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

export default NotificationScheduleController;
