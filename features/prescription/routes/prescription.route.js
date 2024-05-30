import express from 'express';
import { check } from 'express-validator';
import PrescriptionController from '../controllers/prescription.controller.js';
import { isAuth } from '../../../middleware/auth.middlewarw.js';
const router = express.Router();

router.post(
  '/PrescriptionGet',
  isAuth,
  [
    check('UserId').isInt().not().isEmpty(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  PrescriptionController.getPatientPrescriptions
);

router.post(
  '/PrescriptionSave',
  isAuth,
  [
    check('Id').isInt().not().isEmpty(),
    check('PatientUserId').isInt().not().isEmpty(),
    check('DoctorUserId').optional({ nullable: true }).isInt(),
    check('DoctorName').optional({ nullable: true }).isString(),
    check('PrescriptionName').optional({ nullable: true }).isString(),
    check('PrescriptionDate').isDate().not().isEmpty(),
    check('ExpirationDate').optional({ nullable: true }).isDate(),
    check('UserCreated').isInt().not().isEmpty(),
    check('DrugDataSet').isArray().not().isEmpty(),
  ],
  PrescriptionController.savePatientPrescription
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
