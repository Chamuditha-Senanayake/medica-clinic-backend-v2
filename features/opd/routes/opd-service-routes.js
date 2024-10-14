import { Router } from "express";
import {
  getOpdServiceCategories,
  getOpdServicesAndSubCategories,
  getOpdServiceSubCategories,
  saveUpdateOpdService,
  saveUpdateOpdServiceCategory,
  saveUpdateOpdServiceSubCategory,
} from "../controllers/opd-service-controller.js";

const opdServices = Router();

opdServices.post("/save-update-category", saveUpdateOpdServiceCategory);
opdServices.post("/save-update-sub-category", saveUpdateOpdServiceSubCategory);
opdServices.post("/save-update", saveUpdateOpdService);
opdServices.post("/get-categories", getOpdServiceCategories);
opdServices.post("/get-sub-categories", getOpdServiceSubCategories);
opdServices.post(
  "/get-services-and-sub-categories",
  getOpdServicesAndSubCategories
);

export default opdServices;
