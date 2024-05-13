import express from "express";
import { check } from "express-validator";
import CaregiverController from "../controllers/caregiver.controller.js";
const router = express.Router();

router.post(
  "/CaregiverAssign",
  [ 
    check("CaregiverName").not().isEmpty().isString(),
    check("CaregiverEmail").not().isEmpty().isString(),
  ],
  CaregiverController.assignCaregiver
);

// router.post(
//   "/NurseGet",
//   [
//     check("Id").not().isEmpty(),
//     check("NurseUserId").not().isEmpty(),
//     check("UserId").not().isEmpty(),
//   ],
//   NurseController.getNurse
// );

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
//   NurseController.saveNurse
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
//   NurseController.SaveNurseBranch
// );

// router.post(
//   "/DoctorNurseSave",
//   [
//     check("Id").not().isEmpty(),
//     check("DoctorId").not().isEmpty(),
//     check("NurseId").not().isEmpty(),
//     check("Status").not().isEmpty(),
//     check("UserSaved").not().isEmpty(),
//   ],
//   NurseController.SaveDoctorNurse
// );

export default router;