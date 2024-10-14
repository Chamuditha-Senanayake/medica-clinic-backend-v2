import express from "express";
import { check } from "express-validator";
import QualificationController from "../controller/qualification.controller.js";
const router = express.Router();

router.post(
  "/Qualification/Get",
  [check("UserId").isInt().not().isEmpty()],
  QualificationController.getQualification
);

export default router;
