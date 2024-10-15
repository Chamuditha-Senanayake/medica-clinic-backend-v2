import { Router } from "express";
import {
  appointmentOnGoing,
  appointmentReport,
  appointmentsForSms,
  getAppointments,
  savePatientResponse,
  saveUpdateAppointment,
} from "../controllers/appointment-controller.js";

const appointmentRoutes = Router();

appointmentRoutes.post("/get", getAppointments);
appointmentRoutes.post("/appointment-save-or-update", saveUpdateAppointment);

appointmentRoutes.post(`/appointments-for-sms`, appointmentsForSms);

appointmentRoutes.post(`/save-patient-response`, savePatientResponse);

appointmentRoutes.post(`/appointment-reports/get`, appointmentReport);

appointmentRoutes.post(`/appointment-ongoing/get/`, appointmentOnGoing);

export default appointmentRoutes;
