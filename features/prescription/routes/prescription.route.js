import express from 'express';
import { check } from 'express-validator';
import PrescriptionController from '../controllers/prescription.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
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
  '/PrescriptionGetById',
  isAuth,
  [check('Id').isInt().not().isEmpty()],
  PrescriptionController.getPatientPrescriptionById
);

router.post(
  '/PrescriptionSave',
  isAuth,
  [
    check('Id').isInt().not().isEmpty(),
    check('PatientUserId').isInt().not().isEmpty(),
    check('RecordId').optional({ nullable: true }).isInt(),
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
  '/PrescriptionDelete',
  isAuth,
  [check('PrescriptionId').isInt().not().isEmpty()],
  PrescriptionController.deletePatientPrescription
);

router.post(
  '/PrescriptionDrugsGet',
  isAuth,
  [
    check('PrescriptionId').isInt().not().isEmpty(),
    check('Page').optional({ nullable: true }).isInt(),
    check('Limit').optional({ nullable: true }).isInt(),
  ],
  PrescriptionController.getPatientPrescriptionDrugs
);

export default router;
