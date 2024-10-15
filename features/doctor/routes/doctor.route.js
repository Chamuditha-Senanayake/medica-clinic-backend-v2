import express from "express";
import { check } from "express-validator";
import DoctorController from "../controllers/doctor.controller.js";
const router = express.Router();

router.post(
  "/Doctor/Get",
  [
    check("Id").optional().isInt(),
    check("DoctorUserId").optional().isInt(),
    check("UserId").optional().isInt(),
  ],
  DoctorController.getDoctor
);

router.post(
  "/doctor/post",
  [
    check("Id").not().isEmpty().isInt(),
    check("FirstName").not().isEmpty().isString().isLength({ max: 50 }),
    check("MiddleName").not().isEmpty().isString().isLength({ max: 50 }),
    check("LastName").not().isEmpty().isString().isLength({ max: 50 }),
    check("Email").not().isEmpty().isEmail().isLength({ max: 100 }),
    check("NIC").not().isEmpty().isString().isLength({ max: 20 }),
    check("Status").optional().isInt(),
    check("UserSaved").optional({ values: "null" }).isInt(),
    check("RegistrationNumber")
      .not()
      .isEmpty()
      .isString()
      .isLength({ max: 10 }),
    check("DateOfBirth").not().isEmpty().isString(),
    check("Title").not().isEmpty().isString().isLength({ max: 10 }),
    check("ZoomEmail")
      .optional({ values: "null" })
      .isEmail()
      .isString()
      .isLength({ max: 50 }),
    check("ZoomPassword")
      .optional({ values: "null" })
      .isString()
      .withMessage("ZoomPassword must be a string if provided")
      .isLength({ max: 150 }),
    check("DoctorFee").optional().isFloat(),
    check("HospitalFee").optional().isFloat(),
    check("OtherFee").optional().isFloat(),
  ],
  DoctorController.saveDoctor
);

router.post(
  "/DoctorSpecializationsGet",
  [
    check("DoctorId").optional({ values: "null" }).isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  DoctorController.getDoctorSpecializations
);

router.post(
  "/DoctorSpecializationsSave",
  [
    check("DoctorId").not().isEmpty().isInt(),
    check("SpecializationId").not().isEmpty().isInt(),
    check("Status").not().isEmpty().isInt(),
    check("UserSaved").not().isEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  DoctorController.saveDoctorSpecialization
);

router.post(
  "/DoctorChannelingStatusGet",
  [
    check("UserId").optional({ values: "null" }).isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("SessionId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
  ],
  DoctorController.DoctorChannelingStatusGet
);

router.post(
  "/DoctorChanalingStatus/Save",
  [
    check("SessionId").optional().isInt(),
    check("PatientId").optional().isInt(),
    check("AppointmentId").optional().isInt(),
    check("UserId").not().isEmpty().isInt(),
    check("Id").optional().isInt(),
    check("DoctorStatus").optional().isString(),
    check("ChanalingStatus").optional().isString(),
  ],
  DoctorController.DoctorChannelingStatusSave
);

router.post(
  "/DoctorContactNumber/GetContactNumber",
  [
    check("Id").optional({ values: "null" }).isInt(),
    check("DoctorId").optional({ values: "null" }).isInt(),
    check("ContactNumber").optional({ values: "null" }).isString(),
    check("UserId").not().isEmpty().isInt(),
  ],
  DoctorController.getDoctorSpecializations
);

router.post(
  "/DoctorDispositionReminder/Get",
  [check("UserId").not().isEmpty().isInt(), check("PatientId").isInt()],
  DoctorController.DoctorDispositionReminderGet
);

router.post(
  "/DoctorDispositionReminder/Save",
  [
    check("Id").optional().isInt(),
    check("PrescriptionRecordId").optional().isInt(),
    check("AppointmentId").optional().isInt(),
    check("PatientId").optional().isInt(),
    check("RemindFromDate").optional().isString(),
    check("RemindType").optional().isString(),
    check("Message").optional().isString(),
    check("Status").optional().isInt(),
    check("UserSaved").not().isEmpty().isInt(),
  ],
  DoctorController.DoctorDispositionReminderSave
);

router.post(
  "/Doctor/GetByUser",
  [check("UserId").not().isEmpty().isInt()],
  DoctorController.getDoctorByUserId
);

export default router;
