import express from 'express';
import { check } from 'express-validator';
import DoctorController from '../controllers/doctor.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAuthorizedDoctor } from '../../../middleware/doctor.middleware.js';

const router = express.Router();

router.post(
  '/DoctorRequest',
  isAuth,
  isActiveUser,
  [
    check('DoctorEmail').not().isEmpty().isString(),
    check('DoctorName').optional({ nullable: true }).isString(),
    check('Status')
      .isIn(['invited', 'enabled', 'disabled', 'deleted'])
      .optional({ nullable: true })
      .isString(),
  ],
  DoctorController.requestDoctor
);

router.post(
  '/DoctorRespond',
  isAuth,
  isActiveUser,
  [
    check('DoctorEmail').not().isEmpty().isString(),
    check('Status')
      .isIn(['accepted', 'rejected'])
      .optional({ nullable: true })
      .isString(),
    check('Token').not().isEmpty().isString(),
  ],
  DoctorController.respondDoctor
);

router.post(
  '/DoctorTokenValidation',
  isAuth,
  isActiveUser,
  [check('Token').not().isEmpty().isString()],
  DoctorController.tokenValidation
);

router.post(
  '/DoctorRequestPatientAccess',
  isAuth,
  isActiveUser,
  isAuthorizedDoctor,
  [check('PatientId').isInt().not().isEmpty()],
  DoctorController.issueDoctorPatientToken
);

router.post(
  '/DoctorPatientsGet',
  isAuth,
  isActiveUser,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('Page').optional({ nullable: true }).isInt(),
    check('Limit').optional({ nullable: true }).isInt(),
  ],
  DoctorController.getDoctorPatients
);

export default router;
