import express from 'express';
import { check } from 'express-validator';
import LabController from '../controllers/lab.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
const router = express.Router();

router.post(
  '/LabReportsGet',
  isAuth,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('PatientUserId').isInt().not().isEmpty(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  LabController.getPatientLabReports
);

router.post(
  '/LabReportGetById',
  isAuth,
  [check('Id').isInt().not().isEmpty()],
  LabController.getPatientLabReportById
);

router.post(
  '/LabReportSave',
  isAuth,
  [
    check('PatientUserId').isInt().not().isEmpty(),
    check('RecordId').optional({ nullable: true }).isInt(),
    check('DoctorUserId').optional({ nullable: true }).isInt(),
    check('DoctorName').optional({ nullable: true }).isString(),
    check('TestType').isString().not().isEmpty(),
    check('Laboratory').optional({ nullable: true }).isString(),
    check('Diagnosis').optional({ nullable: true }).isString(),
    check('Description').optional({ nullable: true }).isString(),
    check('Files').optional({ nullable: true }).isArray(),
  ],
  LabController.savePatientLabReports
);

router.post(
  '/LabReportDelete',
  isAuth,
  [check('Id').isInt().not().isEmpty()],
  LabController.deletePatientLabReports
);

export default router;
