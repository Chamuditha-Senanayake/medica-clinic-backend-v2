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

router.post(
  "/MedicalAnalyticsSave",
  [
    check("PrescriptionId").isInt().not().isEmpty(),
    check("AppointmentId").isInt().not().isEmpty(),
    check("AppointmentNumber").isInt().not().isEmpty(),
    check("AppointmentSessionId").isInt().not().isEmpty(),
    check("AppointmentStatus").isInt().not().isEmpty(),
    check("PatientId").isInt().not().isEmpty(),
    check("PatientParentId").isInt().not().isEmpty(),
    check("PatientPatientTypeId").isInt().not().isEmpty(),
    check("PatientBloodGroup").isInt().not().isEmpty(),
    check("PatientStatus").isInt().not().isEmpty(),
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
    check("Weight").not().isEmpty(),
    check("Height").not().isEmpty(),
    check("BloodPressureSystolic").not().isEmpty(),
    check("BloodPressureDiastolic").not().isEmpty(),
    check("Temperature").not().isEmpty(),
    check("PulseRate").not().isEmpty(),
    check("SE").not().isEmpty(),
    check("CholesterolHDL").not().isEmpty(),
    check("Cholesterol").not().isEmpty(),
    check("CholesterolLDL").not().isEmpty(),
    check("WaistCircumference").not().isEmpty(),
    check("HbA1c").not().isEmpty(),
    check("UMicroAlbumin").not().isEmpty(),
    check("UrineProtein24").not().isEmpty(),
    check("HrPPG2").not().isEmpty(),
    check("FastingBloodSugar").not().isEmpty(),
    check("Creatinine").not().isEmpty(),
    check("UFR").not().isEmpty(),
    check("Tg").not().isEmpty(),
    check("Hb").not().isEmpty(),
    check("LipidProfile").not().isEmpty(),
    check("FPG").not().isEmpty(),
    check("TC").not().isEmpty(),
    check("RPG").not().isEmpty(),
    check("Urea").not().isEmpty(),
    check("FCB").not().isEmpty(),
    check("UrineCulture").not().isEmpty(),
    check("TCHDL").not().isEmpty(),
    check("Dengue").not().isEmpty(),
    check("VLDL").not().isEmpty(),
    check("Stools").not().isEmpty(),
    check("Hepatitis").not().isEmpty(),
  ],
  AnalyticsController.saveMedicalAnalytics
);


export default router;