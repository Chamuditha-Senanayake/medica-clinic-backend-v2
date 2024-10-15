import { Router } from "express";
import {
  deleteEmployee,
  getAll,
  getAllEmployee,
  getEmployee,
  getInstituteBranchEmployee,
  resetPassword,
  saveEmployee,
} from "../controllers/employee-controller.js";

const employeeRoutes = Router();

employeeRoutes.post("/reset-password", resetPassword);
employeeRoutes.post("/get-all-employees", getAll);

employeeRoutes.post(`/save`, saveEmployee);
employeeRoutes.post(`/get-all`, getAllEmployee);
employeeRoutes.post(`/delete`, deleteEmployee);
employeeRoutes.post(`/get`, getEmployee);
employeeRoutes.post(`/institute-branch/get`, getInstituteBranchEmployee);

export default employeeRoutes;
