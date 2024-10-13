import express from "express";
import { check } from "express-validator";
import ReferralLetterController from "../controller/referral.letter.controller.js";
const router = express.Router();

router.post(
  "/Template/Get",
  [check("Id").optional().isInt(), check("UserId").optional().isInt()],
  ReferralLetterController.getReferralLetterTemplate
);

//    Status,
//    UserId,
router.post(
  "/ReferralLetter/post",
  [
    check("Id").optional().isInt(),
    check("AppointmentId").optional().isInt(),
    check("AppointmentNumber").optional().not().isEmpty(),
    check("AppointmentSessionId").optional().isInt(),
    check("IssuingDate").optional().isString(),
    check("Message").optional().isString(),
    check("PatientBloodGroup").optional().isString(),
    check("PatientDateOfBirth").optional().isString(),
    check("PatientFirstName").optional().isString(),
    check("PatientId").optional().isInt(),
    check("PatientLastName").optional().isString(),
    check("PatientMiddleName").optional().isString(),
    check("PatientNIC").optional().isString(),
    check("PatientPassport").optional().isString(),
    check("PatientPatientTypeId").optional().isInt(),
    check("PatientStatus").optional().isInt(),
    check("PrescriptionId").optional().isInt(),
    check("ReferringDoctor").optional().isString(),
    check("PatientMobile").optional().isString(),
    check("Status").optional().isInt(),
    check("UserId").optional().isInt(),
  ],
  ReferralLetterController.getReferralLetterTemplate
);

export default router;
