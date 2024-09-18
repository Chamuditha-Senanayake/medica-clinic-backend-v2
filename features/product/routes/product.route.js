import express from "express";
import { check } from "express-validator";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

router.post(
  "/GetProductByExtIdAndBranch",
  [
    check("ExtId").not().isEmpty(),
    check("InstituteBranchId").not().isEmpty(),
    check("Type").optional({ values: "Doctor" }).isString(),
  ],
  ProductController.getProductByExtIdAndBranch
);

export default router;
