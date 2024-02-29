import express from "express";
import { check } from "express-validator";
import AnalyticsController from "../controllers/analytics.controller.js";
const router = express.Router();

router.post(
  "/MedicalAnalyticsGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("SessionId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Id").isInt().not().isEmpty(),
  ],
  AnalyticsController.getMedicalAnalytics
);


export default router;