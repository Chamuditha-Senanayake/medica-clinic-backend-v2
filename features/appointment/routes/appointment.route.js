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
    check("PatientMobile").optional({ values: "null" }).isString(),
  ],
  AppointmentController.getAppointment
);

export default router;
