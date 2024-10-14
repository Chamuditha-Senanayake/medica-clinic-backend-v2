import express from "express";
import { check } from "express-validator";
import SpecializationController from "../controller/specialization.controller.js";
const router = express.Router();

router.post(
  "/Specialization/Get",
  [check("UserId").isInt().not().isEmpty()],
  SpecializationController.getSpecializations
);

export default router;
