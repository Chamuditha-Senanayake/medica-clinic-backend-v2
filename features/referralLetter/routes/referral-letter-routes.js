import { Router } from "express";
import { getReferralLetters } from "../controller/referral-letter-controller.js";

const referralLetterRoutes = Router();

referralLetterRoutes.post("/get", getReferralLetters);

export default referralLetterRoutes;
