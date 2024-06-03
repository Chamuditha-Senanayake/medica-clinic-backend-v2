import express from 'express';
import { check } from 'express-validator';
import NotificationScheduleController from '../controllers/notificationSchedule.controller.js';
const router = express.Router();

router.post(
  '/NotificationScheduleGet',
  [],
  NotificationScheduleController.getNotificationSchedule
);

router.post(
  '/NotificationScheduleUpdate',
  [
    check('ScheduleId').isInt().not().isEmpty(),
    check('MediumId').not().isEmpty(),
    check('Status').isInt().not().isEmpty(),
  ],
  NotificationScheduleController.updateNotificationSchedule
);

export default router;
