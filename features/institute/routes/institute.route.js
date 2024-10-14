import express from "express";
import { check } from "express-validator";
import InstituteController from "../controllers/institute.controller.js";
const router = express.Router();

router.post(
  "/DoctorBranch/GetInstituteBranchDoctor",
  [
    check("Id").optional().isInt(),
    check("InstituteBranchId").optional().isInt(),
    check("UserId").optional().isInt(),
  ],
  InstituteController.getInstituteBranchDoctor
);

router.post(
  "/InstituteBranchDoctorSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("InstituteBranchId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  InstituteController.saveInstituteBranchDoctor
);

router.post(
  "/InstituteBranch/GetInstituteBranch",
  [
    check("Id").optional().isInt(),
    check("DoctorId").optional().isInt(),
    check("InstituteId").optional().isInt(),
    check("UserId").optional().isInt(),
  ],
  InstituteController.getInstituteBranch
);

router.post(
  "/InstituteBranchSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("InstituteId").isInt().not().isEmpty(),
    check("Name").not().isEmpty(),
    check("AddressId").isInt().not().isEmpty(),
    check("Email").not().isEmpty(),
    check("Website").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  InstituteController.saveInstituteBranch
);

router.post(
  "/InstituteDoctorGet",
  [
    check("InstituteId").isInt().not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  InstituteController.getInstituteDoctor
);

router.post(
  "/Institute/Get",
  [check("Id").optional().isInt(), check("UserId").not().isEmpty()],
  InstituteController.getInstitute
);

router.post(
  "/InstituteSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("Name").not().isEmpty(),
    check("Email").not().isEmpty(),
    check("Website").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  InstituteController.saveInstitute
);

router.post(
  "/InstituteDoctor/GetInstituteByDoctor",
  [check("Id").isInt().not().isEmpty(), check("UserId").not().isEmpty()],
  InstituteController.getInstituteByDoctor
);
export default router;
