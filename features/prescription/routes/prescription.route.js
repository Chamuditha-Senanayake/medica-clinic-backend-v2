import express from "express";
import { check } from "express-validator";
import PrescriptionController from "../controllers/prescription.controller.js";
const router = express.Router();

router.post(
  "/PrescriptionRecordCountGet",
  [
    check("UserId").not().isEmpty(),
    check("DoctorId").not().isEmpty(),
    check("DateFrom").not().isEmpty(),
    check("DateTo").not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordCount
);

// router.post(
//   "/NurseSave",
//   [
//     check("Id").isInt(),
//     check("FirstName").not().isEmpty(),
//     check("MiddleName").not().isEmpty(),
//     check("LastName").not().isEmpty(),
//     check("Email").not().isEmpty().isEmail(),    
//     check("NIC").not().isEmpty(),
//     check("Title").not().isEmpty(),
//     check("Status").not().isEmpty(),
//     check("UserSaved").not().isEmpty(),
//   ],
//   PrescriptionController.saveNurse
// );

// router.post(
//   "/NurseBranchSave",
//   [
//     check("Id").not().isEmpty(),
//     check("InstituteBranchId").not().isEmpty(),
//     check("NurseId").not().isEmpty(),
//     check("Status").not().isEmpty(),
//     check("UserSaved").not().isEmpty(),
//   ],
//   PrescriptionController.SaveNurseBranch
// );

export default router;