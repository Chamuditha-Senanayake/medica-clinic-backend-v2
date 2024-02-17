import express from "express";
import { check } from "express-validator";
import MedicalCertificateController from "../controllers/medicalCertificate.controller.js";
const router = express.Router();

router.post(
  "/MedicalCertificateGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("SessionId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Id").isInt().not().isEmpty(),
  ],
  MedicalCertificateController.getMedicalCertificate
);


export default router;