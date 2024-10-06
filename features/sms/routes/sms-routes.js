import { Router } from "express";
import { sendAppointmentNotification, sendSessionNotification } from "../controller/sms-controller.js";


const smsRoutes = Router();

smsRoutes.post("/send-appointment-notification", sendAppointmentNotification);
smsRoutes.post("/send-session-notification", sendSessionNotification);


export default smsRoutes;
