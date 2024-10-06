import moment from "moment";
import {
  APPOINTMENT_NOTIFICATION_TYPES,
  DOCTOR_NOTIFICATION_TYPES,
  SESSION_NOTIFICATION_TYPES,
} from "../../../constants/notification-types.js";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { sendMessage } from "../../../utils/sendMesssage.js";
import formattedString from "../../../utils/formatted-string.js";

const formatContactNumber = (contactNumber) => {
  if (contactNumber) {
    return "0" + contactNumber.replace(/^94/, "");
  } else {
    return "";
  }
};

export const sendAppointmentNotification = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { AppointmentId, NotificationType } = req.body;

    if (
      !Object.values(APPOINTMENT_NOTIFICATION_TYPES).includes(NotificationType)
    ) {
      handleError(
        res,
        500,
        "error",
        "Invalid Notification Type",
        new Error("Invalid Notification Type")
      );
    }

    let appointment = await executeSp({
      spName: "AppointmentDetailsGet",
      params: [
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: AppointmentId,
        },
      ],
      connection,
    });

    appointment = appointment?.recordsets?.[0]?.[0];

    if (appointment?.Patient) {
      appointment.Patient = JSON.parse(appointment.Patient);
    }
    if (appointment?.Doctor) {
      appointment.Doctor = JSON.parse(appointment.Doctor);
    }
    if (appointment?.Institute) {
      appointment.Institute = JSON.parse(appointment.Institute);
    }
    if (appointment?.InstituteBranchContactNumbers) {
      appointment.InstituteBranchContactNumbers = JSON.parse(
        appointment.InstituteBranchContactNumbers
      );
    }
    if (appointment?.SmsConfigs) {
      appointment.SmsConfigs = JSON.parse(appointment.SmsConfigs);
    }

    console.log(appointment);

    if (!appointment) {
      handleError(
        res,
        404,
        "error",
        "Appointment Not Found",
        new Error("Appointment Not Found")
      );
    }

    let sesionStart = moment.utc(appointment.TimeStart).format("hh:mma");
    let sesionEnd = moment.utc(appointment.TimeEnd).format("hh:mma");
    let sessionDate = moment.utc(appointment.TimeStart).format("YYYY-MM-DD");
    let doctorName = `${appointment.Doctor?.Title} ${appointment.Doctor?.FirstName} ${appointment.Doctor?.LastName}`;
    let instituteName = `${appointment.Institute?.Name}`;

    // doctor name is too much long short it
    if (doctorName.length > 30) {
      doctorName = doctorName.substring(0, 30);
    }

    // institute name is too much long short it
    if (instituteName.length > 30) {
      instituteName = instituteName.substring(0, 30);
    }

    console.log(sesionStart, sesionEnd);

    /**
     *  0 - doctor name
     *  1 - institute name
     *  2 - appointment number
     *  3 - session start
     *  4 - session end
     *  5 - session date
     *  6 - appointment id
     *  7 - institute branch contact number
     */
    let message = null;
    switch (NotificationType) {
      case APPOINTMENT_NOTIFICATION_TYPES.APPOINTMENT_PLACED: {
        message = `Appointment placed. {0}, {1}, Apt No {2}, {3}-{4}, {5} (Ref {6}) Call: {7}`;
        if (appointment?.SmsConfigs?.HideAptNumber) {
          message = `Appointment placed. {0}, {1}, {3}-{4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
      case APPOINTMENT_NOTIFICATION_TYPES.APPOINTMENT_CANCELLED: {
        break;
      }
      case APPOINTMENT_NOTIFICATION_TYPES.APPOINTMENT_RESCHEDULED: {
        break;
      }
      case APPOINTMENT_NOTIFICATION_TYPES.APPOINTMENT_UPDATED: {
        message = `Appointment updated. {0}, {1}, Apt No {2}, {3}-{4}, {5} (Ref {6}) Call: {7}`;
        if (appointment?.SmsConfigs?.HideAptNumber) {
          message = `Appointment updated. {0}, {1}, {3}-{4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
    }

    if (message) {
      let messageToPatient = formattedString({
        format: message,
        args: [
          doctorName,
          instituteName,
          appointment.Number,
          sesionStart,
          sesionEnd,
          sessionDate,
          appointment.Id,
          appointment.InstituteBranchContactNumbers.length > 0
            ? `${formatContactNumber(
                appointment.InstituteBranchContactNumbers[0]?.ContactNumber
              )}`
            : "",
        ],
      });

      // sendMessage({
      //   mobileNumber: appointment.Patient?.Mobile,
      //   message: messageToPatient,
      //   instituteId:
      //     NotificationType === APPOINTMENT_NOTIFICATION_TYPES.APPOINTMENT_PLACED
      //       ? "DEFAULT"
      //       : appointment?.Institute?.Id,
      // });

      sendMessage({
        mobileNumber: appointment.Patient?.Mobile,
        message: messageToPatient,
        instituteId: appointment?.Institute?.Id,
      });
    } else {
      handleError(res, 500, "error", "Something went wrong", error);
    }

    handleResponse(res, 200, "success", "Operation Success", {});
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sendSessionNotification = async (req, res, next) => {
  try {
    const { SessionId, NotificationType } = req.body;
    let connection = req.app.locals.db;

    if (
      ![
        ...Object.values(SESSION_NOTIFICATION_TYPES),
        ...Object.values(DOCTOR_NOTIFICATION_TYPES),
      ].includes(NotificationType)
    ) {
      handleError(
        res,
        500,
        "error",
        "Invalid Notification Type",
        new Error("Invalid Notification Type")
      );
    }

    let session = await executeSp({
      spName: "SessionDetailsGet",
      params: [
        {
          name: "SessionId",
          type: sql.TYPES.Int,
          value: SessionId,
        },
      ],
      connection,
    });

    session = session?.recordsets?.[0]?.[0];

    if (session?.Doctor) {
      session.Doctor = JSON.parse(session.Doctor);
    }
    if (session?.Appointments) {
      session.Appointments = JSON.parse(session.Appointments);
    }
    if (session?.Institute) {
      session.Institute = JSON.parse(session.Institute);
    }
    if (session?.InstituteBranchContactNumbers) {
      session.InstituteBranchContactNumbers = JSON.parse(
        session.InstituteBranchContactNumbers
      );
    }
    if (session?.SmsConfigs) {
      session.SmsConfigs = JSON.parse(session.SmsConfigs);
    }

    if (!session) {
      handleError(
        res,
        404,
        "error",
        "Session Not Found",
        new Error("Session Not Found")
      );
    }

    let sesionStart = moment.utc(session.TimeStart).format("hh:mma");
    let sesionEnd = moment.utc(session.TimeEnd).format("hh:mma");
    let sessionDate = moment.utc(session.TimeStart).format("YYYY-MM-DD");
    let doctorName = `${session.Doctor?.Title} ${session.Doctor?.FirstName} ${session.Doctor?.LastName}`;
    let instituteName = `${session.Institute?.Name}`;

    // doctor name is too much long short it
    if (doctorName.length > 30) {
      doctorName = doctorName.substring(0, 30);
    }

    // institute name is too much long short it
    if (instituteName.length > 30) {
      instituteName = instituteName.substring(0, 30);
    }

    /**
     *  0 - doctor name
     *  1 - institute name
     *  2 - appointment number
     *  3 - session start
     *  4 - session end
     *  5 - session date
     *  6 - appointment id
     *  7 - institute branch contact number
     */
    let message = null;
    let messagePatient = "";
    switch (NotificationType) {
      case SESSION_NOTIFICATION_TYPES.SESSION_UPDATED: {
        message = `Session Updated. {0}, {1}, Apt No {2}, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        if (session?.SmsConfigs?.HideAptNumber) {
          message = `Session Updated. {0}, {1}, {3}-{4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
      case SESSION_NOTIFICATION_TYPES.SESSION_CANCELLED: {
        message = `Session Cancelled. {0} at {1}, {3} - {4}, {5} Call: {7}`;
        break;
      }
      case DOCTOR_NOTIFICATION_TYPES.DOCTOR_ARRIVED: {
        message = `{0} at {1} has arrived, Apt No {2}, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        if (session?.SmsConfigs?.HideAptNumber) {
          message = `{0} at {1} has arrived, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
      case DOCTOR_NOTIFICATION_TYPES.DOCTOR_DELAYED: {
        message = `{0} at {1} is delayed, Apt No {2}, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        if (session?.SmsConfigs?.HideAptNumber) {
          message = `{0} at {1} is delayed, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
      case DOCTOR_NOTIFICATION_TYPES.DOCTOR_LEFT: {
        message = `{0} at {1} has left, Apt No {2}, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        if (session?.SmsConfigs?.HideAptNumber) {
          message = `{0} at {1} has left, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
      case DOCTOR_NOTIFICATION_TYPES.DOCTOR_ARRIVED_EARLY: {
        message = `{0} at {1} has arrived early, Apt No {2}, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        if (session?.SmsConfigs?.HideAptNumber) {
          message = `{0} at {1} has arrived early, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
      case DOCTOR_NOTIFICATION_TYPES.DOCTOR_CANCELLED: {
        message = `{0} at {1} has cancelled, Apt No {2}, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        if (session?.SmsConfigs?.HideAptNumber) {
          message = `{0} at {1} has cancelled, {3} - {4}, {5} (Ref {6}) Call: {7}`;
        }
        break;
      }
    }
    if (
      Array.isArray(session.Appointments) &&
      session.Appointments.length > 0
    ) {
      session.Appointments.forEach((appointment) => {
        if (
          appointment.ChannelingStatus === "pending" &&
          appointment.PatientId !== 183390
        ) {
          let messageToPatient = formattedString({
            format: message,
            args: [
              doctorName,
              instituteName,
              appointment.Number,
              sesionStart,
              sesionEnd,
              sessionDate,
              appointment.Id,
              session.InstituteBranchContactNumbers.length > 0
                ? `${formatContactNumber(
                    session.InstituteBranchContactNumbers[0]?.ContactNumber
                  )}`
                : "",
            ],
          });
          sendMessage({
            mobileNumber: appointment?.Mobile,
            message: messageToPatient,
            instituteId: session?.Institute?.Id,
          });
        }
      });
    }
    handleResponse(res, 200, "success", "Operation Success", messagePatient);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
