import express from "express";
import { check } from "express-validator";
import DoctorController from "../controllers/doctor.controller.js";
const router = express.Router();

router.post(
  "/DoctorGet",
  [
    check("Id").not().isEmpty().isInt(),
    check("DoctorUserId").not().isEmpty().isInt(),
    check("UserId").not().isEmpty().isInt(),
  ],
  DoctorController.getDoctor
);

router.post(
  "/DoctorSave",
  [
    check("Id").not().isEmpty().isInt(),
    check("FirstName").not().isEmpty().isString().isLength({ max: 50 }),
    check("MiddleName").not().isEmpty().isString().isLength({ max: 50 }),
    check("LastName").not().isEmpty().isString().isLength({ max: 50 }),
    check("Email").not().isEmpty().isEmail().isLength({ max: 100 }),
    check("NIC").not().isEmpty().isString().isLength({ max: 20 }),
    check("Status").not().isEmpty().isInt(),
    check("UserSaved").optional({ values: "null" }).isInt(),
    check("RegistrationNumber")
      .not()
      .isEmpty()
      .isString()
      .isLength({ max: 10 }),
    check("DateOfBirth").not().isEmpty().isString(),
    check("Title").not().isEmpty().isString().isLength({ max: 10 }),
    check("ZoomEmail")
      .optional({ values: "null" })
      .isEmail()
      .isString()
      .isLength({ max: 50 }),
    check("ZoomPassword")
      .optional({ values: "null" })
      .isString()
      .withMessage("ZoomPassword must be a string if provided")
      .isLength({ max: 150 }),
    check("Chargers")
      .optional({ values: "null" })
      .isString()
      .isLength({ max: 50 }),
    check("ContactNumbers")
      .isArray()
      .withMessage("ContactNumbers must be an array")
      .notEmpty()
      .withMessage("ContactNumbers array cannot be empty")
      .custom((contactNumbersArray) => {
        for (const contact of contactNumbersArray) {
          if (typeof contact !== "object" || contact === null) {
            throw new Error("Each item in ContactNumbers must be an object");
          }

          if (
            !("Number" in contact) ||
            !("Status" in contact) ||
            !("Id" in contact)
          ) {
            throw new Error(
              "Each item in ContactNumbers must have 'Number' and 'Status' and 'Id'"
            );
          }

          if (
            typeof contact.Number !== "string" &&
            contact.Number.length > 15
          ) {
            throw new Error("Contact Number must be a string");
          }

          if (typeof contact.Status !== "number") {
            throw new Error("Contact Status must be a number");
          }

          if (contact.Id) {
            if (typeof contact.Id !== "number") {
              throw new Error("Contact Id must be a number");
            }
          }

          // Example: Ensure that the Status is either 0 or 1
          // TODO: should implement in future
          // if (![0, 1].includes(contact.Status)) {
          //   throw new Error("Contact Status must be either 0 or 1");
          // }
        }

        return true;
      }),
  ],
  DoctorController.saveDoctor
);

router.post(
  "/DoctorSpecializationsGet",
  [
    check("DoctorId").optional({ values: "null" }).isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  DoctorController.getDoctorSpecializations
);

router.post(
  "/DoctorSpecializationsSave",
  [
    check("DoctorId").not().isEmpty().isInt(),
    check("SpecializationId").not().isEmpty().isInt(),
    check("Status").not().isEmpty().isInt(),
    check("UserSaved").not().isEmpty().isInt(),
    check("Id").optional({ values: "null" }).isInt(),
  ],
  DoctorController.saveDoctorSpecialization
);

router.post(
  "/DoctorChannelingStatusGet",
  [
    check("UserId").optional({ values: "null" }).isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("AppointmentId").optional({ values: "null" }).isInt(),
    check("SessionId").optional({ values: "null" }).isInt(),
    check("PatientId").optional({ values: "null" }).isInt(),
  ],
  DoctorController.DoctorChannelingStatusGet
);

router.post(
  "/DoctorChannelingStatusSave",
  [
    check("SessionId").isInt(),
    check("PatientId").isInt(),
    check("AppointmentId").isInt(),
    check("UserSaved").isInt(),
    check("Id").optional({ values: "null" }).isInt(),
    check("DoctorStatus").optional({ values: "null" }).isString(),
    check("ChanalingStatus").optional({ values: "null" }).isString(),
  ],
  DoctorController.DoctorChannelingStatusSave
);

router.post(
  "/DoctorContactNumberGet",
  [
    check("Id").optional({ values: "null" }).isInt(),
    check("DoctorId").optional({ values: "null" }).isInt(),
    check("ContactNumber").optional({ values: "null" }).isString(),
    check("UserId").isInt(),
  ],
  DoctorController.DoctorContactNumberGet
);

export default router;
