import express from 'express';
import { check } from 'express-validator';
import PrescriptionController from '../controllers/prescription.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAuthorizedCaregiver } from '../../../middleware/caregiver.middleware.js';
import { isAuthorizedHelper } from '../../../middleware/helper.middleware.js';
import { isAuthorizedDoctor } from '../../../middleware/doctor.middleware.js';
const router = express.Router();

router.post(
  '/PrescriptionGet',
  isAuth,
  isActiveUser,
  isAuthorizedCaregiver,
  isAuthorizedHelper,
  isAuthorizedDoctor,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('PatientUserId').isInt().not().isEmpty(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  PrescriptionController.getPatientPrescriptions
);

router.post(
  '/PrescriptionGetById',
  isAuth,
  isActiveUser,
  [check('Id').isInt().not().isEmpty()],
  PrescriptionController.getPatientPrescriptionById
);

router.post(
  '/PrescriptionSave',
  isAuth,
  isActiveUser,
  isAuthorizedCaregiver,
  isAuthorizedHelper,
  isAuthorizedDoctor,
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
    check('Files').optional({ nullable: true }).isArray(),
  ],
  PrescriptionController.savePatientPrescription
);

router.post(
  '/PrescriptionDelete',
  isAuth,
  isActiveUser,
  [check('PrescriptionId').isInt().not().isEmpty()],
  PrescriptionController.deletePatientPrescription
);

router.post(
  '/PrescriptionDrugsGet',
  isAuth,
  isActiveUser,
  [
    check('PrescriptionId').isInt().not().isEmpty(),
    check('Page').optional({ nullable: true }).isInt(),
    check('Limit').optional({ nullable: true }).isInt(),
  ],
  PrescriptionController.getPatientPrescriptionDrugs
);

export default router;
