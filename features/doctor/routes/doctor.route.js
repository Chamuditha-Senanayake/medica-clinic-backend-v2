import express from "express";
import { check } from "express-validator";
import DoctorController from "../controllers/doctor.controller.js";
const router = express.Router();

router.post(
  "/DoctorGet",
  [
    check("Id").not().isEmpty(),
    check("DoctorUserId").not().isEmpty(),
    check("UserId").not().isEmpty(),
  ],
  DoctorController.getDoctor
);

router.post(
  "/DoctorSave",
  [
    check("Id").not().isEmpty(),
    check("FirstName").not().isEmpty(),
    check("MiddleName").not().isEmpty(),
    check("LastName").not().isEmpty(),
    check("Email").not().isEmpty().isEmail(),
    check("NIC").not().isEmpty(),
    check("Status").not().isEmpty(),
    check("UserSaved").not().isEmpty(),
    // check("ContactNumbers").not().isEmpty().isMobilePhone(),
    check("RegistrationNumber").not().isEmpty(),
    check("DateOfBirth").not().isEmpty().isString(),
    check("Title").not().isEmpty(),
    check("ZoomEmail").optional({ values: "null" }).isEmail(),
    check("ZoomPassword")
      .optional({ values: "null" })
      .isString()
      .withMessage("ZoomPassword must be a string if provided"),
    check("Chargers").optional({ values: "null" }),
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

          if (!("Number" in contact) || !("Status" in contact)) {
            throw new Error(
              "Each item in ContactNumbers must have 'Number' and 'Status'"
            );
          }

          if (typeof contact.Number !== "string") {
            throw new Error("Contact Number must be a string");
          }

          if (typeof contact.Status !== "number") {
            throw new Error("Contact Status must be a number");
          }

          // Add additional validation logic as needed for Id, Number, and Status

          // Example: Ensure that the Status is either 0 or 1
          if (![0, 1].includes(contact.Status)) {
            throw new Error("Contact Status must be either 0 or 1");
          }
        }

        return true;
      }),
  ],
  DoctorController.saveDoctor
);

router.post(
  "/DoctorSpecializationsGet",
  [check("DoctorId").not().isEmpty(), check("Id").not().isEmpty()],
  DoctorController.getDoctorSpecializations
);

router.post(
  "/DoctorSpecializationsSave",
  [
    check("DoctorId").not().isEmpty(),
    check("SpecializationId").not().isEmpty(),
    check("Status").not().isEmpty(),
    check("UserSaved").not().isEmpty(),
    check("Id").not().isEmpty(),
  ],
  DoctorController.saveDoctorSpecialization
);

export default router;
