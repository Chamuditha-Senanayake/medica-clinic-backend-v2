import express from "express";
import { check } from "express-validator";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/AddressGet",
  [check("UserId").notEmpty().isInt(), check("Id").notEmpty().isInt()],
  UserController.getAddress
);

router.post(
  "/AddressSave",
  [
    check("AddressLine1").notEmpty().isString().isLength({ max: 75 }),
    check("AddressLine2")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 75 }),
    check("Suburb")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 75 }),
    check("City").optional({ values: "null" }).isString().isLength({ max: 75 }),
    check("Postcode")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 75 }),
    check("Country")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 75 }),
    check("Status").optional({ values: "null" }).isInt(),
    check("UserSaved").notEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("LocalTran").optional({ values: "null" }).isString(),
    check("OperationUniqueId").optional({ values: "null" }).isString(),
  ],
  UserController.saveAddress
);

router.post(
  "/DeleteRecord",
  [
    check("Id").notEmpty().isInt(),
    check("Table").notEmpty().isString(),
    check("UserId").notEmpty().isInt(),
  ],
  UserController.deleteRecord
);

router.post(
  "/OCRSaves",
  [
    check("UUID").optional({ values: "null" }).isString(),
    check("RefrenceNo").optional({ values: "null" }).isString(),
    check("OCRResult").optional({ values: "null" }).isString(),
    check("UserSaved").notEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("UserId").optional({ values: "null" }).isInt(),
  ],
  UserController.ocrSaves
);

router.post(
  "/Authenticate",
  [
    check("UserName").optional({ values: "null" }).isString(),
    check("Password").optional({ values: "null" }).isString(),
    check("RememberMe").optional({ values: "null" }).isInt(),
    check("AccessToken").optional({ values: "null" }).isString(),
    check("UserAgent").optional({ values: "null" }).isString(),
  ],
  UserController.authenticate
);

router.post(
  "/OTPCheck",
  [
    check("Mobile").notEmpty().isString().isLength({ max: 15 }),
    check("OTP").notEmpty().isInt(),
  ],
  UserController.checkOTP
);

router.post(
  "/OTPGet",
  [
    check("Mobile")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 15 }),
    check("PatientId").optional({ values: "null" }).isInt(),
  ],
  UserController.getOTP
);

router.post(
  "/PasswordReset",
  [check("UserId").notEmpty().isInt(), check("Password").notEmpty().isString()],
  UserController.resetPassword
);
export default router;
