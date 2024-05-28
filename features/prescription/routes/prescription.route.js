import express from 'express';
import { check } from 'express-validator';
import PrescriptionController from '../controllers/prescription.controller.js';
const router = express.Router();

router.post(
  '/PrescriptionSave',
  [
    check('Id').isInt().not().isEmpty(),
    check('PatientUserId').isInt().not().isEmpty(),
    check('DoctorUserId').optional({ nullable: true }).isInt(),
    check('DoctorName').optional({ nullable: true }).isString(),
    check('PrescriptionName').optional({ nullable: true }).isString(),
    check('PrescriptionDate').isDate().not().isEmpty(),
    check('ExpirationDate').isDate().not().isEmpty(),
    check('UserCreated').isInt().not().isEmpty(),
  ],
  PrescriptionController.savePrescription
);

router.post(
  '/PrescriptionRecordCountGet',
  [
    check('UserId').isInt().not().isEmpty(),
    check('DoctorId').isInt().not().isEmpty(),
    check('DateFrom').not().isEmpty(),
    check('DateTo').not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordCount
);

router.post(
  '/PrescriptionRecordDiseaseCountGet',
  [
    check('UserId').isInt().not().isEmpty(),
    check('DoctorId').isInt().not().isEmpty(),
    check('DateFrom').not().isEmpty(),
    check('DateTo').not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordDiseaseCount
);

router.post(
  '/PrescriptionRecordDiseaseDetailsGet',
  [
    check('UserId').isInt().not().isEmpty(),
    check('DoctorId').isInt().not().isEmpty(),
    check('DateFrom').not().isEmpty(),
    check('DateTo').not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordDiseaseDetails
);

router.post(
  '/PrescriptionRecordDrugCountGet',
  [
    check('UserId').isInt().not().isEmpty(),
    check('DoctorId').isInt().not().isEmpty(),
    check('DateFrom').not().isEmpty(),
    check('DateTo').not().isEmpty(),
  ],
  PrescriptionController.getPrescriptionRecordDrugCount
);

export default router;
