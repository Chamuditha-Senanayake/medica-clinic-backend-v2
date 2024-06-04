import express from 'express';
import { check } from 'express-validator';
import CaregiverController from '../controllers/caregiver.controller.js';
import { isAuth } from '../../../middleware/auth.middlewarw.js';
const router = express.Router();

router.post(
  '/CaregiverRequest',
  isAuth,
  [
    check('CaregiverEmail').not().isEmpty().isString(),
    check('CaregiverName').not().isEmpty().isString(),
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

export default router;
