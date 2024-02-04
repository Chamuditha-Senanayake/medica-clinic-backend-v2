import express from "express";
import { check } from "express-validator";
import PatientController from "../controllers/patient.controller.js";
const router = express.Router();

router.post(
  "/PatientDiagnosisDocumentGet",
  [
    check("Id").not().isEmpty(),
     check("PatientId").not().isEmpty(),
    check("UserId").not().isEmpty(),
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

export default router;