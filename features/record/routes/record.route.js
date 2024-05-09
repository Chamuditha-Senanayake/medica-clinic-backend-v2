import express from "express";
import { check } from "express-validator";
import RecordController from "../controllers/record.controller.js";
const router = express.Router();

router.post(
  "/RecordGet",
  [
    check("UserId").isInt().not().isEmpty(),
  ],
  RecordController.getPatientRecords
);

router.post(
  "/RecordSave",
  [
    check("Id").isInt().not().isEmpty(),
    check("UserId").isInt().not().isEmpty(),
    check("DoctorId").isInt().not().isEmpty(),
    check("BodyPart").isString().not().isEmpty(),
    check("SubBodyPart").isString().not().isEmpty(),
    check("SubBodyPartType").optional({nullable:true}).isString(),
    check("Date").isString().not().isEmpty(),
    check("Diagnosis").isString().not().isEmpty(),
    check("Notes").isString().not().isEmpty(),
    check("UserSaved").isInt().not().isEmpty(),
  ],
  RecordController.savePatientRecord
);

export default router;