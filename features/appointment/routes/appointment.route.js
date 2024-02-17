import express from "express";
import { check } from "express-validator";
import AppointmentController from "../controllers/appointment.controller.js";

const router = express.Router();

router.post(
  "/AppointmentGet",
  [
    check("UserId").not().isEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("Number").optional({ values: "null" }).isInt(),
    check("SessionId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
    check("PatientMobile").optional({ values: "null" }).isString().isLength(15),
  ],
  AppointmentController.getAppointment
);

router.post(
  "/AppointmentSave",
  [
    check("Number").not().isEmpty().isInt(),
    check("SessionId").not().isEmpty().isInt(),
    check("PatientId").not().isEmpty().isInt(),
    check("Status").not().isEmpty().isInt(),
    check("UserSaved").not().isEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  AppointmentController.saveAppointment
);

router.post(
  "/AppointmentGetNext",
  [
    check("UserId").not().isEmpty().isInt(),
    check("SessionId").not().isEmpty().isInt(),
  ],
  AppointmentController.appointmentGetNext
);

router.post(
  "/AppointmentReport",
  [
    check("UserId").not().isEmpty().isInt(),
    check("FromDate").optional({ values: "null" }).isString(),
    check("ToDate").optional({ values: "null" }).isString(),
    check("DoctorId").optional({ values: "null" }).isInt(),
    check("BranchId").optional({ values: "null" }).isInt(),
  ],
  AppointmentController.appointmentReport
);

export default router;
