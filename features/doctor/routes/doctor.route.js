const express = require("express");
const DoctorController = require("../controllers/doctor.controller");
const { check } = require("express-validator");
const router = express.Router();

router.get("/DoctorGet", [], DoctorController.getDoctor);

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
    check("ContactNumbers").not().isEmpty().isMobilePhone(),
    check("RegistrationNumber").not().isEmpty(),
    check("DateOfBirth").not().isEmpty().isDate(),
    check("Title").not().isEmpty(),
    check("ZoomEmail").not().isEmpty().isEmail(),
    check("ZoomPassword").not().isEmpty(),
    check("Chargers").not().isEmpty(),
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

module.exports = router;
