import express from 'express';
import { check } from 'express-validator';
import RecordController from '../controllers/record.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAuthorizedCaregiver } from '../../../middleware/caregiver.middleware.js';
import { isAuthorizedHelper } from '../../../middleware/helper.middleware.js';
import { isAuthorizedDoctor } from '../../../middleware/doctor.middleware.js';
const router = express.Router();

router.post(
  '/RecordGet',
  isAuth,
  isActiveUser,
  isAuthorizedCaregiver,
  isAuthorizedHelper,
  isAuthorizedDoctor,
  [
    check('PatientUserId').isInt().not().isEmpty(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  RecordController.getPatientRecords
);

router.post(
  '/RecordSave',
  isAuth,
  isActiveUser,
  isAuthorizedCaregiver,
  isAuthorizedHelper,
  isAuthorizedDoctor,
  [
    check('Id').isInt().not().isEmpty(),
    check('PatientUserId').isInt().not().isEmpty(),
    check('DoctorUserId').optional({ nullable: true }).isInt(),
    check('DoctorName').optional({ nullable: true }).isString(),
    check('RecordType')
      .isIn(['journal', 'medical', 'clinical'])
      .not()
      .isEmpty(),
    check('BodyPart').isString().not().isEmpty(),
    check('SubBodyPart').isString().not().isEmpty(),
    check('SubBodyPartType').optional({ nullable: true }).isString(),
    check('Date').isString().not().isEmpty(),
    check('Diagnosis').optional({ nullable: true }).isString(),
    check('Symptoms').isString().not().isEmpty(),
    check('Notes').optional({ nullable: true }).isString(),
    check('UserSaved').isInt().optional({ nullable: true }),
    check('Files').optional({ nullable: true }).isArray(),
  ],
  RecordController.savePatientRecord
);

router.post(
  '/RecordDelete',
  isAuth,
  isActiveUser,
  isAuthorizedCaregiver,
  isAuthorizedHelper,
  isAuthorizedDoctor,
  [
    check('PatientUserId').isInt().not().isEmpty(),
    check('Id').isInt().not().isEmpty(),
  ],
  RecordController.deletePatientRecords
);

router.post(
  '/RecordBodyPartsGet',
  isAuth,
  isActiveUser,
  isAuthorizedCaregiver,
  isAuthorizedHelper,
  isAuthorizedDoctor,
  [check('PatientUserId').isInt().not().isEmpty()],
  RecordController.getPatientRecordBodyParts
);

export default router;
