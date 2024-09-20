import express from 'express';
import { check } from 'express-validator';
import DiagnosisController from '../controllers/diagnosis.controller.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
const router = express.Router();

router.post(
  '/DiagnosisGetByName',
  isAuth,
  isActiveUser,
  check('Diagnosis').optional({ nullable: true }).isString(),
  DiagnosisController.getDiagnosisByName
);

export default router;
