import express from "express";
import { check } from "express-validator";
import ReferralLetterController from "../controller/referral.letter.controller.js";
const router = express.Router();

router.post(
  "/Template/Get",
  [check("Id").optional().isInt(), check("UserId").optional().isInt()],
  ReferralLetterController.getReferralLetterTemplate
);

export default router;
