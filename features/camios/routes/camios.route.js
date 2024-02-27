import express from "express";
import { check } from "express-validator";
import CamiosController from "../controllers/camios.controller.js";
const router = express.Router();

router.post(
  "/CamiosRequestGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("SessionId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  CamiosController.getCamiosRequest
);

// router.post(
//   "/CamiosRequestSave",
//   [
//     check("Id").isInt().not().isEmpty(),
//     check("PatientId").isInt().not().isEmpty(),
//     check("Note").not().isEmpty(),
//     check("AgeYears").isInt().not().isEmpty(),
//     check("AgeMonths").isInt().not().isEmpty(),
//     check("Status").isInt().not().isEmpty(),
//     check("UserSaved").isInt().not().isEmpty(),
//   ],
//   CamiosController.saveNote
// );

export default router;