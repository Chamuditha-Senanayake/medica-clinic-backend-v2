import express from "express";
import { check } from "express-validator";
import DispositionController from "../controllers/disposition.controller.js";

const router = express.Router();

router.post(
  "/DispositionNotificationScheduleCreate",
  [
    check("PatientId").optional({ values: "null" }).isInt(),
    check("PrescriptionRecordId").optional({ values: "null" }).isInt(),
    check("Disposition").optional({ values: "null" }).isString(),
    check("UserSaved").optional({ values: "null" }).isInt(),
    check("CurrentDate").optional({ values: "null" }).isDate(),
  ],
  DispositionController.createDispositionNotificationSchedule
);

router.post(
  "/DispositionNotificationScheduleGet",
  [
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
    check("PrescriptionRecordId").optional({ values: "null" }).isString(),
    check("DateOfSending").optional({ values: "null" }).isString(),
    check("Id").optional({ values: "null" }).isInt(),
    check("UserId").optional({ values: "null" }).isInt(),
  ],
  DispositionController.getDispositionNotificationSchedule
);

router.post(
  "/DispositionNotificationScheduleLogGet",
  [
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
    check("PrescriptionRecordId").optional({ values: "null" }).isString(),
    check("DispositionNotificationScheduleId")
      .optional({ values: "null" })
      .isString(),
    check("DateOfSending").optional({ values: "null" }).isString(),
    check("Id").optional({ values: "null" }).isInt(),
    check("UserId").notEmpty().isInt(),
  ],
  DispositionController.getDispositionNotificationScheduleLog
);

router.post(
  "/DispositionNotificationScheduleLogSave",
  [
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
    check("PrescriptionRecordId").optional({ values: "null" }).isInt(),
    check("DispositionNotificationScheduleId")
      .optional({ values: "null" })
      .isInt(),
    check("Disposition")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 500 }),
    check("PatientSMS")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 15 }),
    check("PatientEmail")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 200 }),
    check("PatientSMSData").optional({ values: "null" }).isString(),
    check("PatientEmailData").optional({ values: "null" }).isString(),
    check("PatientSMSStatus").optional({ values: "null" }).isInt(),
    check("PatientEmailStatus").optional({ values: "null" }).isInt(),
    check("DoctorSMS")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 15 }),
    check("DoctorEmail")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 200 }),
    check("DoctorSMSData").optional({ values: "null" }).isString(),
    check("DoctorEmailData").optional({ values: "null" }).isString(),
    check("DoctorSMSStatus").optional({ values: "null" }).isInt(),
    check("DoctorEmailStatus").optional({ values: "null" }).isInt(),
    check("DateOfSending").optional({ values: "null" }).isString(),
    check("UserSaved").optional({ values: "null" }).isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  DispositionController.saveDispositionNotificationScheduleLog
);

router.post(
  "/DispositionScheduleSave",
  [
    check("PatientDispositionId").optional({ values: "null" }).isInt(),
    check("ScheduledTime").notEmpty().isString(),
    check("ContactType")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 50 }),
    check("RecipientID").optional({ values: "null" }).isInt(),
    check("ContactNumber")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 50 }),
    check("MessageMedium").optional({ values: "null" }).isString(),
    check("Message")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 50 }),
    check("Status").notEmpty().isInt(),
    check("UserSaved").notEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("UserId").optional({ values: "null" }).isInt(),
  ],
  DispositionController.saveDispositionSchedule
);

export default router;
