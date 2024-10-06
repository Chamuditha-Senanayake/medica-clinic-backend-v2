import express from "express";
import { check } from "express-validator";
import NotificationScheduleController from "../controllers/notificationSchedule.controller.js";
const router = express.Router();

router.post(
  "/NotificationScheduleGet",
  [

  ],
  NotificationScheduleController.getNotificationSchedule
);

router.post(
  "/NotificationScheduleUpdate",
  [
    check("ScheduleId").isInt().not().isEmpty(),
    check("MediumId").not().isEmpty(),
    check("Status").isInt().not().isEmpty(),
  ],
  NotificationScheduleController.updateNotificationSchedule
);

router.post(`/notification`,[],NotificationScheduleController.notifications);

router.post(`/notificationv2`, NotificationScheduleController.notificationsv2);

router.post(`/notify-patient`, NotificationScheduleController.notifyPatient);

router.post(`/notify-duty-manager`, NotificationScheduleController.notifyDutyManager);



export default router;
