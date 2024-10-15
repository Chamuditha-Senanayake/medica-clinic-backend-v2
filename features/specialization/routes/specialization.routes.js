import express from "express";
import { check } from "express-validator";
import SpecializationController from "../controller/specialization.controller.js";
const router = express.Router();

router.post(
  "/Specialization/Get",
  [check("UserId").isInt().not().isEmpty()],
  SpecializationController.getSpecializations
);

router.post(
  "/Specialization/Get",
  [check("Id").optional().isInt(), check("DoctorId").optional().isInt()],
  SpecializationController.getDoctorSpecializations
);

export default router;
