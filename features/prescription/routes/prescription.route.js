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
    check("PatientId").optional().isInt(),
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

export default router;
