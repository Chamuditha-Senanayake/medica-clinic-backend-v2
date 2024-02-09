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
    check("Id").isInt().not().isEmpty(),
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
    check("Id").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
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

router.post(
  "/GynoObstetricsHistoryGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getGynoObstetricsHistory
);

router.post(
  "/GynoObstetricsHistorySave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("GynoObstetricsHistory").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.saveGynoObstetricsHistory
);

router.post(
  "/PatientDiagnosisDocumentDelete",
  [
    check("Id").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.deletePatientDiagnosisDocument
);

router.post(
  "/PatientNewFoodAllergyGet",
  [
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
    check("Id").isInt().not().isEmpty(),
  ],
  PatientController.getPatientNewFoodAllergy
);

router.post(
  "/PatientNewFoodAllergySave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("AllergyFoods").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientNewFoodAllergy
);

router.post(
  "/PatientGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("NIC").not().isEmpty(),
    check("Passport").not().isEmpty(),
    check("Mobile").not().isEmpty(),
    check("BedHeadTicketNumber").not().isEmpty(),
    check("ClinicId").not().isEmpty(),
    check("UniqueId").not().isEmpty(),
    check("Name").not().isEmpty(),
    check("DateOfBirth").not().isEmpty(),
    check("Address").not().isEmpty(),
    check("ParentId").isInt().not().isEmpty(),
    check("Guid").isInt().not().isEmpty(),
    check("Id").isInt().not().isEmpty(),
  ],
  PatientController.getPatient
);

router.post(
  "/PatientNewSurgeryGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientNewSurgery
);

router.post(
  "/PatientNewSurgerySave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Surgeries").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientNewSurgery
);

router.post(
  "/PatientOtherAllergyGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientOtherAllergy
);

router.post(
  "/PatientOtherAllergySave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Allergies").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientOtherAllergy
);

router.post(
  "/PatientOtherDiseasesGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientOtherAllergy
);

router.post(
  "/PatientOtherDiseasesSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Diseases").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientOtherDiseases
);

router.post(
  "/PatientRelativesGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("RelationId").isInt().not().isEmpty(),
    check("TypeId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientRelatives
);

router.post(
  "/PatientRemarkGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientRemark
);

router.post(
  "/PatientRemarkSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Details").not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
  ],
  PatientController.savePatientRemark
);

router.post(
  "/PatientReminderGet",
  [
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientReminder
);

router.post(
  "/PatientReminderSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Subject").not().isEmpty(),
    check("ReminderType").not().isEmpty(),
    check("Description").not().isEmpty(),
    check("Date").not().isEmpty(),
    check("Time").not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
  ],
  PatientController.savePatientReminder
);

router.post(
  "/PatientReportSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("FileName").not().isEmpty(),
    check("FileLocation").not().isEmpty(),
    check("ReportType").not().isEmpty(),
    check("Description").not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
  ],
  PatientController.savePatientReport
);

router.post(
  "/PatientRobsonInfoGet",
  [
    check("PatientId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientRobsonInfo
);


export default router;