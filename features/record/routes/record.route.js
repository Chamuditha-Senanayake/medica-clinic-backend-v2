import express from 'express';
import { check } from 'express-validator';
import RecordController from '../controllers/record.controller.js';
import { isAuth } from '../../../middleware/auth.middlewarw.js';
const router = express.Router();

router.post(
  '/RecordGet',
  isAuth,
  [
    check('UserId').isInt().not().isEmpty(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  RecordController.getPatientRecords
);

router.post(
  '/RecordSave',
  isAuth,
  [
    check('Id').isInt().not().isEmpty(),
    check('UserId').isInt().not().isEmpty(),
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
    check('UserSaved').isInt().not().isEmpty(),
  ],
  RecordController.savePatientRecord
);

router.post(
  '/RecordDelete',
  isAuth,
  [
    check('UserId').isInt().not().isEmpty(),
    check('Id').isInt().not().isEmpty(),
  ],
  RecordController.deletePatientRecords
);

export default router;
