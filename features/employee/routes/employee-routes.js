import { Router } from "express";
import {
    deleteEmployee,
    getAll,
    getAllEmployee, getEmployee, getInstituteBranchEmployee,
    resetPassword,
    saveEmployee
} from "../controllers/employee-controller.js";

const employeeRoutes = Router();

employeeRoutes.post("/reset-password", resetPassword);
employeeRoutes.post("/get-all-employees", getAll);

employeeRoutes.post(`/employee/save`, saveEmployee);
employeeRoutes.post(`/employee/get-all`, getAllEmployee);
employeeRoutes.post(`/employee/delete`, deleteEmployee);
employeeRoutes.post(`/employee/get`, getEmployee);
employeeRoutes.post(`/employee/institute-branch/get`, getInstituteBranchEmployee);

export default employeeRoutes;
