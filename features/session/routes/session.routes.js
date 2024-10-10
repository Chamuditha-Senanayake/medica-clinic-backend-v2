import express from "express";
import { check } from "express-validator";
import SessionController from "../controller/session.controller.js";
const router = express.Router();

router.post(
  "/Session/Get",
  [check("Id").optional().isInt(), check("UserId").isInt().not().isEmpty()],
  SessionController.getSessions
);

router.post(
  "/Session/GetDefault",
  [check("UserId").isInt().not().isEmpty()],
  SessionController.getDefaultSession
);

export default router;
