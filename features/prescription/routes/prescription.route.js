import express from "express";
import { check } from "express-validator";
import PrescriptionController from "../controllers/prescription.controller.js";
const router = express.Router();

router.post(
  "/PrescriptionRecordCountGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("DateFrom").not().isEmpty(),
    check("DateTo").not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordCount
);

router.post(
  "/PrescriptionRecordDiseaseCountGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("DateFrom").not().isEmpty(),
    check("DateTo").not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordDiseaseCount
);

// router.post(
//   "/PrescriptionRecordDiseaseDetailsGet",
//   [
//     check("UserId").isInt().not().isEmpty(),
//     check("DoctorId").isInt().not().isEmpty(),
//     check("DateFrom").not().isEmpty(),
//     check("DateTo").not().isEmpty(),
//   ],
//   PrescriptionController.getPrescriptionRecords
// );

router.post(
  "/PrescriptionRecord/GetPrescriptionRecord",
  [
    check("UserId").isInt().not().isEmpty(),
    check("SessionId").optional().isInt(),
    check("AppointmentId").optional().isInt(),
    check("PrescriptionId").optional().isInt(),
    check("Id").optional().isInt(),
    check("FromDate").optional().isString(),
    check("ToDate").optional().isString(),
    check("DoctorId").optional().isString(),
    check("SearchType").optional().isString(),
  ],
  PrescriptionController.getPrescriptionRecords
);

router.post(
  "/PrescriptionRecordDrugCountGet",
  [
    check("UserId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("DateFrom").not().isEmpty(),
    check("DateTo").not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordDrugCount
);

router.post(
  "/PrescriptionTemplate/get",
  [check("UserId").isInt().not().isEmpty(), check("Id").optional().isInt()],
  PrescriptionController.getPrescriptionRecordDrugCount
);

router.post(
  "/AppointmentPrescriptionRecordMedica/Save",
  [
    check("AgeMonths").optional().isInt(),
    check("AgeYears").optional().isInt(),
    check("AppointmentId").optional().isInt(),
    check("AppointmentNumber").optional().isInt(),
    check("AppointmentSessionId").optional().isInt(),
    check("AppointmentStatus").optional().isInt(),
    check("BloodPressureDiastolic").optional().isString(),
    check("BloodPressureSystolic").optional().isString(),
    check("Diagnosis").optional().isString(),
    check("Disposition").optional().isObject(),
    check("DispositionSave").optional().isString(),
    check("Doctor").optional().isInt(),
    check("FollowUp").optional().isString(),
    check("Height").optional().isString(),
    check("IllnessData").optional().isString(),
    check("NegativeSx").optional().isString(),
    check("NextVisitDate").optional().isString(),
    check("Note").optional().isString(),
    check("Patient").optional().isObject(),
    check("PositiveSx").optional().isString(),
    check("PrescriptionId").optional().isInt(),
    check("PulseRate").optional().isString(),
    check("RecordDrugs").optional().isArray(),
    check("RedFlag").optional().isString(),
    check("Status").optional().isInt(),
    check("Test").optional().isString(),
    check("UserId").optional().isInt(),
    check("UserSaved").optional().isInt(),
    check("Id").optional().isInt(),
  ],
  PrescriptionController.getPrescriptionRecordDrugCount
);

export default router;
