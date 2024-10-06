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
  async notifications(request, response, next) {

    try {
      const { data } = request.body;
      const randNum = data.slice(data.length - 3);
      console.log(randNum);
      const source = data.slice(0, data.length - 3);
      console.log(source);
      var iv = CryptoJS.enc.Base64.parse(""); //giving empty initialization vector
      var key = CryptoJS.SHA256("notify" + randNum); //hashing the key using SHA256
      var decrypteddata = decryptData(source, iv, key);
      const splitted = decrypteddata.split("||");
      const instituteId = splitted[0];
      const mobileNumber = splitted[1];
      let message = splitted[2];
      console.log(instituteId, mobileNumber, message);

      const sender = senderIds[instituteId];
      if (sender === undefined) {
        throw new Error("Institute not found");
      }
      const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${mobileNumber}&msg=${message}&dr=1`;
      console.log(sendSmsUrl);
      const response = await fetch(sendSmsUrl, {
        method: "GET",
      });
      const reponseBody = await response.text();
      console.log(reponseBody);

      //check whether there is a duty manager
      if (sender.carbonCopy.length > 0) {
        if (message.search("Your") === 0) {
          message = message.replace(
              "Your consultation with",
              "New appointment placed for"
          );
          message = message.replace(" is confirmed", "");
          message = message.split(" Please join")[0];
        }
        sender.carbonCopy.forEach((ccToNumber) => {
          const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${ccToNumber}&msg=${message}&dr=1`;
          console.log(sendSmsUrl);
          const response = fetch(sendSmsUrl, {
            method: "GET",
          });
        });
      }

      handleResponse(response, 200, "success", "Notification sent", {
        message: "Notification sent",
      });
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
  async notificationsv2(request, response, next) {

    try {
      let { message, mobileNumber, instituteId, appointmentId, extRefNo } =
          request.body;
      let connection = request.app.locals.db;

      console.log(instituteId, mobileNumber, message);

      if (extRefNo && appointmentId) {
        const updateQuery = `
      UPDATE Appointments
      SET ExtRefId = '${extRefNo}'
      WHERE Id = ${appointmentId}`;

        const result = await executeQuery({ query: updateQuery, connection });
      }

      const sender = senderIds[instituteId];
      if (sender === undefined) {
        throw new Error("Institute not found");
      }
      const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${mobileNumber}&msg=${message}&dr=1`;
      console.log(sendSmsUrl);
      const response = await fetch(sendSmsUrl, {
        method: "GET",
      });
      const reponseBody = await response.text();
      console.log(reponseBody);

      //check whether there is a duty manager
      if (sender.carbonCopy.length > 0) {
        if (message.search("Your") === 0) {
          message = message.replace(
              "Your consultation with",
              "New appointment placed for"
          );
          message = message.replace(" is confirmed", "");
          message = message.split(" Please join")[0];
        }
        sender.carbonCopy.forEach((ccToNumber) => {
          const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${ccToNumber}&msg=${message}&dr=1`;
          console.log(sendSmsUrl);
          const response = fetch(sendSmsUrl, {
            method: "GET",
          });
        });
      }

      handleResponse(response, 200, "success", "Notification sent", {
        message: "Notification sent",
      });
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
  async notifyPatient(request, response, next) {

    try {
      const { data } = request.body;
      const randNum = data.slice(data.length - 3);
      console.log(randNum);
      const source = data.slice(0, data.length - 3);
      console.log(source);
      var iv = CryptoJS.enc.Base64.parse(""); //giving empty initialization vector
      var key = CryptoJS.SHA256("notify" + randNum); //hashing the key using SHA256
      var decrypteddata = decryptData(source, iv, key);
      const splitted = decrypteddata.split("||");
      const instituteId = splitted[0];
      const mobileNumber = splitted[1];
      let message = splitted[2];
      console.log(instituteId, mobileNumber, message);

      const sender = senderIds[instituteId];
      if (sender === undefined) {
        throw new Error("Institute not found");
      }
      const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${mobileNumber}&msg=${message}&dr=1`;
      console.log(sendSmsUrl);
      const response = await fetch(sendSmsUrl, {
        method: "GET",
      });
      const reponseBody = await response.text();
      console.log(reponseBody);

      handleResponse(response, 200, "success", "Notification sent", {
        message: "Notification sent",
      });
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
  async notifyDutyManager(request, response, next) {

    try {
      const { data } = request.body;
      const randNum = data.slice(data.length - 3);
      console.log(randNum);
      const source = data.slice(0, data.length - 3);
      console.log(source);
      var iv = CryptoJS.enc.Base64.parse(""); //giving empty initialization vector
      var key = CryptoJS.SHA256("notify" + randNum); //hashing the key using SHA256
      var decrypteddata = decryptData(source, iv, key);
      const splitted = decrypteddata.split("||");
      const instituteId = splitted[0];
      const mobileNumber = splitted[1];
      let message = splitted[2];
      console.log(instituteId, mobileNumber, message);

      const sender = senderIds[instituteId];
      if (sender === undefined) {
        throw new Error("Institute not found");
      }
      const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${mobileNumber}&msg=${message}&dr=1`;
      console.log(sendSmsUrl);

      //check whether there is a duty manager
      if (sender.carbonCopy.length > 0) {
        sender.carbonCopy.forEach((ccToNumber) => {
          const sendSmsUrl = `${process.env.SMS_GATEWAY_BASE_URL}?username=${sender.username}&password=${sender.password}&src=${sender.senderId}&dst=${ccToNumber}&msg=${message}&dr=1`;
          console.log(sendSmsUrl);
          const response = fetch(sendSmsUrl, {
            method: "GET",
          });
        });
      } else {
        throw new Error("No Carbon copies defined");
      }

      handleResponse(response, 200, "success", "Notification sent", {
        message: "Notification sent",
      });
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
