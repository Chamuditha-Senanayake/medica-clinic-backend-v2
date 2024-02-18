import express from "express";
import { check } from "express-validator";
import UserController from "../controllers/user.controller";

const router = express.Router();

router.post(
  "/AddressGet",
  [check("UserId").notEmpty().isInt(), check("Id").notEmpty().isInt()],
  UserController.getAddress
);

export default router;
