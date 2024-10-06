import { Router } from "express";
import {
  getNearestPharmacies,
  getPharmacyPurchaseByStatus,
  savePharmacyPurchase,
  updatePharmacyPurchaseStatus,
} from "../controller/pharmacy-controller.js";

const pharmacyRoutes = Router();

pharmacyRoutes.post("/nearest-pharmacies", getNearestPharmacies);
pharmacyRoutes.post("/save-pharmacy-purchase", savePharmacyPurchase);
pharmacyRoutes.post(
  "/update-pharmacy-purchase-status",
  updatePharmacyPurchaseStatus
);
pharmacyRoutes.post(
  "/get-pharmacy-purchases-by-status",
  getPharmacyPurchaseByStatus
);

export default pharmacyRoutes;
