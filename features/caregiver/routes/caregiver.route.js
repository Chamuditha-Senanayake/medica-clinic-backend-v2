import express from 'express';
import { check } from 'express-validator';
import CaregiverController from '../controllers/caregiver.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isCaregiver } from '../../../middleware/caregiver.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';

const router = express.Router();

router.post(
  '/CaregiverRequest',
  isAuth,
  isActiveUser,
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
  isAuth,
  isActiveUser,
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
  isAuth,
  isActiveUser,
  [check('Token').not().isEmpty().isString()],
  CaregiverController.tokenValidation
);

router.post(
  '/CaregiverRequestPatientAccess',
  isAuth,
  isActiveUser,
  isCaregiver,
  [check('PatientId').isInt().not().isEmpty()],
  CaregiverController.issueCaregiverPatientToken
);

router.post(
  '/CaregiverPatientsGet',
  isAuth,
  isActiveUser,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('Page').optional({ nullable: true }).isInt(),
    check('Limit').optional({ nullable: true }).isInt(),
  ],
  CaregiverController.getCaregiverPatients
);

export default router;
