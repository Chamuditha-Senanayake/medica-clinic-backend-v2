import express from "express";
import { check } from "express-validator";
import DiseaseController from "../controllers/disease.controller.js";
const router = express.Router();

router.post(
  "/DiseaseGet",
  [
    check("Id").not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  DiseaseController.getDisease
);

router.post(
  "/DiseaseSave",
  [
    check("Id").isInt(),
    check("Name").not().isEmpty(),
    check("Status").not().isEmpty(),
    check("UserSaved").not().isEmpty(),
  ],
  DiseaseController.saveDisease
);

export default router;