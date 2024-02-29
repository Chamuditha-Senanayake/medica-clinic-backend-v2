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

router.post(
  "/MedicalCertificateSave",
  [
    check("PrescriptionId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("AppointmentNumber").isInt().not().isEmpty(),
    check("AppointmentSessionId").isInt().not().isEmpty(),
    check("AppointmentStatus").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("PatientParentId").isInt().not().isEmpty(),
    check("PatientPatientTypeId").isInt().not().isEmpty(),
    check("PatientStatus").isInt().not().isEmpty(),
    check("RecommendedDays").isInt().not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
    check("Id").isInt().not().isEmpty(),

    check("PatientTitle").not().isEmpty(),
    check("PatientFirstName").not().isEmpty(),
    check("PatientMiddleName").not().isEmpty(),
    check("PatientLastName").not().isEmpty(),
    check("PatientNIC").not().isEmpty(),
    check("PatientPassport").not().isEmpty(),
    check("PatientMobile").not().isEmpty(),
    check("PatientEmail").not().isEmpty(),
    check("PatientDateOfBirth").not().isEmpty(),
    check("PatientGender").not().isEmpty(),
    check("PatientBloodGroup").not().isEmpty(),
    check("ResidentialAddress").not().isEmpty(),
    check("Employment").not().isEmpty(),
    check("NatureOfDiesease").not().isEmpty(),
    check("LeaveWithEffectFrom").not().isEmpty(),
    check("Remark").not().isEmpty(),
    check("IssuingDate").not().isEmpty(),
  ],
  MedicalCertificateController.saveMedicalCertificate
);


export default router;