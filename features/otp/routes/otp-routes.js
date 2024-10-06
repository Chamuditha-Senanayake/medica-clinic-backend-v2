import { Router } from "express";
import { sendOtp, verifyOtp } from "../controller/otp-controller.js";

const otpRoutes = Router();

otpRoutes.post("/otp-v2", sendOtp);
otpRoutes.post("/verify-otp-v2", verifyOtp);

export default otpRoutes;
