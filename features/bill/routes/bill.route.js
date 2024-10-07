import express from "express";
import { check } from "express-validator";
import BillController from "../controllers/bill.controller.js";
const router = express.Router();

router.post(
  "/Bill/Post",
  [
    check("Id").not().isEmpty().isInt(),
    check("SessionId").optional({ values: "null" }).isInt(),
    check("DoctorId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("AppointmentNumber").not().isEmpty().isString(),
    check("Total").not().isEmpty().isString(),
    check("Discount").not().isEmpty().isString(),
    check("UserSaved").not().isEmpty().isInt(),
  ],
  BillController.saveBill
);

router.post(
  "/MedicalBillGet",
  [
    check("UserId").not().isEmpty().isInt(),
    check("SessionId").optional({ values: "null" }).isInt(),
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  BillController.getMedicalBills
);

router.post(
  "/medicalBillGetResult",
  [
    check("PrescriptionId").notEmpty().isInt(),
    check("AppointmentId").notEmpty().isInt(),
    check("AppointmentNumber").notEmpty().isInt(),
    check("AppointmentSessionId").notEmpty().isInt(),
    check("AppointmentStatus").notEmpty().isInt(),
    check("PatientId").notEmpty().isInt(),
    check("PatientTitle").optional({ values: "null" }).isString(),
    check("PatientFirstName").optional({ values: "null" }).isString(),
    check("PatientMiddleName").optional({ values: "null" }).isString(),
    check("PatientLastName").optional({ values: "null" }).isString(),
    check("PatientNIC").optional({ values: "null" }).isString(),
    check("PatientPassport").optional({ values: "null" }).isString(),
    check("PatientMobile").optional({ values: "null" }).isString(),
    check("PatientEmail").optional({ values: "null" }).isString(),
    check("PatientDateOfBirth").optional({ values: "null" }).isString(),
    check("PatientGender").optional({ values: "null" }).isString(),
    check("PatientParentId").optional({ values: "null" }).isInt(),
    check("PatientPatientTypeId").optional({ values: "null" }).isInt(),
    check("PatientBloodGroup").optional({ values: "null" }).isString(),
    check("PatientInvalidOTPAttempts").optional({ values: "null" }).isInt(),
    check("PatientStatus").optional({ values: "null" }).isInt(),
    check("HomeAddress").notEmpty().isString(),
    check("OfficeAddress").notEmpty().isString(),
    check("ChargesForDrugs").optional({ values: "null" }).isDecimal(),
    check("ChargesForDoctor").optional({ values: "null" }).isDecimal(),
    check("ChargesForInvestigations").optional({ values: "null" }).isDecimal(),
    check("ChargesForOther").optional({ values: "null" }).isDecimal(),
    check("IssuingDate").optional({ values: "null" }).isString(),
    check("Status").notEmpty().isInt(),
    check("UserSaved").notEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  BillController.getMedicalBillResults
);

export default router;
