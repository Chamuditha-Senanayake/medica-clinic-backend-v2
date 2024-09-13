import express from "express";
import { check } from "express-validator";
import DoctorBookingController from "../controllers/doctorBooking.controller.js";

const router = express.Router();

router.post(
  "/GetBookingsByProductId",
  [check("ProductId").not().isEmpty(), check("SessionDate").not().isEmpty()],
  DoctorBookingController.getProductByProductId
);

export default router;
