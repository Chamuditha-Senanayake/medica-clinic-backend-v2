import express from "express";
import { check } from "express-validator";
import NurseController from "../controllers/nurse.controller.js";
const router = express.Router();

router.post(
  "/NurseGet",
  [
    check("Id").not().isEmpty(),
    check("NurseUserId").not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  NurseController.getNurse
);

export default router;