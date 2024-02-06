import express from "express";
import { check } from "express-validator";
import EmployeeController from "../controllers/employee.controller.js";
const router = express.Router();

router.post(
  "/EmployeeBranchGet",
  [
    check("Id").isInt().not().isEmpty(),
    check("InstituteBranchId").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
  ],
  EmployeeController.getEmployeeBranch
);

router.post(
  "/EmployeeBranchSave",
  [
    check("Id").isInt(),
    check("InstituteBranchId").isInt().not().isEmpty(),
    check("EmployeeId").isInt().not().isEmpty(),
    check("Status").not().isEmpty(),
    check("UserSaved").not().isEmpty(),
  ],
  EmployeeController.saveEmployeeBranch
);

router.post(
  "/EmployeeInstituteBranchGet",
  [
    check("Id").not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  EmployeeController.getEmployeeInstituteBranch
);

router.post(
  "/EmployeeSave",
  [
    check("Id").isInt(),
    check("FirstName").not().isEmpty(),
    check("MiddleName").not().isEmpty(),
    check("LastName").not().isEmpty(),
    check("NIC").not().isEmpty(),
    check("Email").not().isEmpty(),
    check("Status").not().isEmpty(),
    check("UserSaved").not().isEmpty(),
  ],
  EmployeeController.saveEmployee
);

export default router;