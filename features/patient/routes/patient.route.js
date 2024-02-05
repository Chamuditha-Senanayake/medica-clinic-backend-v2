import express from "express";
import { check } from "express-validator";
import PatientController from "../controllers/patient.controller.js";
const router = express.Router();

router.post(
  "/PatientDiagnosisDocumentGet",
  [
    check("Id").isInt().not().isEmpty(),
     check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientDiagnosisDocument
);

router.post(
  "/PatientDiagnosisDocumentSave",
  [
    check("PatientId").isInt(),
    check("Type").not().isEmpty(),
    check("FileName").not().isEmpty(),
    check("Id").isInt(),
    check("Name").not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  PatientController.savePatientDiagnosisDocument
);

router.post(
  "/PatientDiseaseSave",
  [
    check("PatientId").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
    check("PatientDisease").not().isEmpty(),
  ],
  PatientController.savePatientDisease
);

router.post(
  "/PatientDispositionGet",
  [
    check("Id").not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  PatientController.getPatientDisposition
);

router.post(
  "/PatientDispositionSave",
  [
    check("AppointmentId").isInt().not().isEmpty(),
    check("PrescriptionId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("InstituteId").isInt().not().isEmpty(),
    check("DispositionId").isInt().not().isEmpty(),
    check("DispositionTypeId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("ServiceTypeId").isInt().not().isEmpty(),

    check("DispositionValue").not().isEmpty(),
    check("Note").not().isEmpty(),
    check("NextVisitOption").not().isEmpty(),
    check("ReminderType").not().isEmpty(),
    check("ReminderMessage").not().isEmpty(),

    check("UserSaved").isInt().not().isEmpty(),
    check("Id").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.savePatientDisposition
);

router.post(
  "/PatientDrugAllergyGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientDrugAllergy
);


export default router;