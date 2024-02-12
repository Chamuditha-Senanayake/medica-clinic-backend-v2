import express from "express";
import { check } from "express-validator";
import DoctorController from "../controllers/doctor.controller.js";
const router = express.Router();

router.post("/BillSave", [
  check("Id").not().isEmpty().isInt(),
  check("SessionId").optional({ values: "null" }).isInt(),
  check("DoctorId").optional({ values: "null" }).isInt(),
  check("PatientId").optional({ values: "null" }).isInt(),
  check("AppointmentId").optional({ values: "null" }).isInt(),
  check("AppointmentNumber").not().isEmpty().isString(),
  check("Total").not().isEmpty().isString(),
  check("Discount").not().isEmpty().isString(),
  // TODO: billDataSet data type
  check("BillDataSet").not().isEmpty().isInt(),
  check("UserSaved").not().isEmpty().isInt(),
]);

export default router;
