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
    check("UserId").optional().isInt(),
    check("NIC").optional({ values: "" }).isString(),
    check("Passport").optional({ values: "" }).isString(),
    check("Mobile").optional({ values: "" }).isString(),
    check("BedHeadTicketNumber").optional({ values: "" }).isString(),
    check("ClinicId").optional({ values: "" }).isString(),
    check("UniqueId").optional({ values: "" }).isString(),
    check("Name").optional({ values: "" }).isString(),
    check("DateOfBirth").optional({ values: "" }).isString(),
    check("Address").optional({ values: "" }).isString(),
    check("ParentId").optional({ values: "" }).isInt(),
    check("Guid").optional({ values: "" }).isString(),
    check("Id").optional().isInt(),
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
  [check("PatientId").isInt().not().isEmpty()],
  PatientController.getPatientRobsonInfo
);

router.post(
  "/PatientRobsonReportDataGet",
  [check("UserId").isInt().not().isEmpty()],
  PatientController.getPatientRobsonReportData
);

router.post(
  "/PatientRobsonInfoSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Parity").not().isEmpty(),
    check("PreviousCs").not().isEmpty(),
    check("OnsetOfLabour").not().isEmpty(),
    check("NoOfFetuses").not().isEmpty(),
    check("GestationalAge").not().isEmpty(),
    check("Presentation").not().isEmpty(),
    check("DeliveryMode").not().isEmpty(),
    check("DeliveryOutcome").not().isEmpty(),
    check("DeliveryComplications").not().isEmpty(),
    check("CsElectiveIndications").not().isEmpty(),
    check("CsEmergencyIndications").not().isEmpty(),
    check("Notes").not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientRobsonInfo
);

router.post(
  "/PatientStatusGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  PatientController.getPatientStatus
);

router.post(
  "/PatientSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("ParentId").isInt().not().isEmpty(),
    check("PatientTypeId").isInt().not().isEmpty(),
    check("InvalidOTPAttempts").isInt().not().isEmpty(),
    check("AddressId").isInt().not().isEmpty(),
    // check("RelationId").isInt().not().isEmpty(),
    // check("RelationTypeId").isInt().not().isEmpty(),
    check("MaritalStatus").isInt().not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
    check("AgeGroupId").isInt().not().isEmpty(),
    check("EthnicGroupId").isInt().not().isEmpty(),
    check("EducationLevelId").isInt().not().isEmpty(),
    check("ReligionId").isInt().not().isEmpty(),
    check("SpiritualityId").isInt().not().isEmpty(),
    check("IncomeGroupId").isInt().not().isEmpty(),
    check("PatientStatusSave").isInt().not().isEmpty(),
    check("PatientStatusId").isInt().not().isEmpty(),
    check("PatientStatusStatusType").isInt().not().isEmpty(),
    check("PatientStatusStatus").isInt().not().isEmpty(),
    check("Guid").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
    check("LocalTran").isInt().not().isEmpty(),
    check("OperationUniqueId").not().isEmpty(),

    check("Title").not().isEmpty(),
    check("FirstName").not().isEmpty(),
    check("MiddleName").not().isEmpty(),
    check("LastName").not().isEmpty(),
    check("NIC").not().isEmpty(),
    check("Passport").not().isEmpty(),
    check("Mobile").not().isEmpty(),
    check("BedHeadTicketNumber").not().isEmpty(),
    check("ClinicId").not().isEmpty(),
    check("UniqueId").not().isEmpty(),
    check("Email").not().isEmpty(),
    check("Gender").not().isEmpty(),
    check("DateOfBirth").not().isEmpty(),
    check("BloodGroup").not().isEmpty(),
    check("AddressLine1").not().isEmpty(),
    check("AddressLine2").not().isEmpty(),
    check("Suburb").not().isEmpty(),
    check("City").not().isEmpty(),
    check("Postcode").not().isEmpty(),
    check("Province").not().isEmpty(),
    check("Country").not().isEmpty(),
    check("EmergencyContact").not().isEmpty(),
    check("Occupation").not().isEmpty(),
    check("PHIArea").not().isEmpty(),
    check("MOH").not().isEmpty(),
    check("GNDivision").not().isEmpty(),
    check("PatientStatusStatusDate").not().isEmpty(),
  ],
  PatientController.savePatient
);

router.post(
  "/ConsultationSave",
  [
    check("AppointmentId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("PrescriptionRecordId").isInt().not().isEmpty(),
    check("CovidSymptoms").not().isEmpty(),
    check("CovidLab").not().isEmpty(),
    check("Treatment").not().isEmpty(),
    check("DisCharge").not().isEmpty(),
    check("PatientCare").not().isEmpty(),
    check("WasteManagment").not().isEmpty(),
    check("RiskFactors").not().isEmpty(),
    check("Management").not().isEmpty(),
    check("Advice").not().isEmpty(),
    check("Prevention").not().isEmpty(),
  ],
  PatientController.saveConsultation
);

router.post(
  "/PatientDeceasedGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("NIC").not().isEmpty(),
    check("Passport").not().isEmpty(),
    check("Mobile").not().isEmpty(),
    check("MOH").not().isEmpty(),
    check("GNDivision").not().isEmpty(),
    check("Id").isInt().not().isEmpty(),
    check("Limit").not().isEmpty(),
  ],
  PatientController.getPatientDeceased
);

router.post(
  "/IllnessDataDetailGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("SessionId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("PrescriptionRecordId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("Id").not().isEmpty(),
  ],
  PatientController.getIllnessDataDetail
);

router.post(
  "/IllnessDataDetailSave",
  [
    check("AppointmentId").isInt().not().isEmpty(),
    check("AppointmentNumber").isInt().not().isEmpty(),
    check("AppointmentSessionId").isInt().not().isEmpty(),
    check("AppointmentStatus").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("PatientParentId").isInt().not().isEmpty(),
    check("PatientPatientTypeId").isInt().not().isEmpty(),
    check("PatientStatus").isInt().not().isEmpty(),
    check("EpisodeType").isInt().not().isEmpty(),
    check("PrescriptionRecordId").isInt().not().isEmpty(),
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
    check("CurrentEpisodeDuration").not().isEmpty(),
    check("TotalDuration").not().isEmpty(),
    check("OnsetDescription").not().isEmpty(),
    check("Profile").not().isEmpty(),
    check("PrecipitatingFactors").not().isEmpty(),
    check("PredisposingFactors").not().isEmpty(),
    check("RelievingFactors").not().isEmpty(),
    check("FunctionalStatus").not().isEmpty(),
    check("FamilyMedicineVitalSigns").not().isEmpty(),
    check("ChronicDiseaseMx").not().isEmpty(),
    check("CurrentMedications").not().isEmpty(),
    check("Weight").not().isEmpty(),
    check("Height").not().isEmpty(),
    check("BloodPressureSystolic").not().isEmpty(),
    check("BloodPressureDiastolic").not().isEmpty(),
    check("Temperature").not().isEmpty(),
    check("Pulse").not().isEmpty(),
    check("RespiratoryRate").not().isEmpty(),
    check("WaistCircumference").not().isEmpty(),
  ],
  PatientController.saveIllnessDataDetail
);

router.post(
  "/PatientCountGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("DateFrom").not().isEmpty(),
    check("DateTo").not().isEmpty(),
  ],
  PatientController.getPatientCount
);

router.post(
  "/PatientDrugAllergySave",
  [
    check("PatientId").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientDrugAllergy
);

router.post(
  "/PatientFoodAllergySave",
  [
    check("PatientId").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  PatientController.savePatientFoodAllergy
);

export default router;
