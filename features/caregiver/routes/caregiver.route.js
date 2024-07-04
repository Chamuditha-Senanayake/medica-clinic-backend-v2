import express from 'express';
import { check } from 'express-validator';
import CaregiverController from '../controllers/caregiver.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isCaregiver } from '../../../middleware/caregiver.middleware.js';
const router = express.Router();

router.post(
  '/CaregiverRequest',
  isAuth,
  [
    check('CaregiverEmail').not().isEmpty().isString(),
    check('CaregiverName').optional({ nullable: true }).isString(),
    check('Status')
      .isIn(['invited', 'enabled', 'disabled', 'deleted'])
      .optional({ nullable: true })
      .isString(),
  ],
  CaregiverController.requestCaregiver
);

router.post(
  '/CaregiverRespond',
  [
    check('CaregiverEmail').not().isEmpty().isString(),
    check('Status')
      .isIn(['accepted', 'rejected'])
      .optional({ nullable: true })
      .isString(),
    check('Token').not().isEmpty().isString(),
  ],
  CaregiverController.respondCaregiver
);

router.post(
  '/CaregiverTokenValidation',
  [check('Token').not().isEmpty().isString()],
  CaregiverController.tokenValidation
);

router.post(
  '/CaregiverRequestPatientAccess',
  isAuth,
  isCaregiver,
  [check('PatientId').isInt().not().isEmpty()],
  CaregiverController.issueCaregiverPatientToken
);

router.post(
  '/CaregiverPatientsGet',
  isAuth,
  [
    check('Page').optional({ nullable: true }).isInt(),
    check('Limit').optional({ nullable: true }).isInt(),
  ],
  CaregiverController.getCaregiverPatients
);

export default router;
