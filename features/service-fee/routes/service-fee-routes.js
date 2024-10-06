import { Router } from "express";
import {
  getServicesByInstitute,
  serviceFeeSave,
} from "../controller/service-fee-controller.js";

const serviceFeeRoutes = Router();

serviceFeeRoutes.post("/save", serviceFeeSave);
serviceFeeRoutes.post("/get-all-by-institute", getServicesByInstitute);

export default serviceFeeRoutes;
