import express from 'express';
import { check } from 'express-validator';
import MedicaController from '../controllers/medica.controller.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
const router = express.Router();

router.post(
  '/AccessRequest',
  isAuth,
  isActiveUser,
  MedicaController.userAccessRequest
);

router.post(
  '/AccessRequestValidation',
  isAuth,
  isActiveUser,
  [
    check('Id').optional({ nullable: true }).isInt(),
    check('MedicaDoctorUserId').isInt().not().isEmpty(),
    check('MedicaDoctorId').isInt().not().isEmpty(),
    check('RelationStatus').optional({ nullable: true }).isString(),
    check('Token').not().isEmpty().isString(),
  ],

  MedicaController.userAccessRequestValidation
);

export default router;
