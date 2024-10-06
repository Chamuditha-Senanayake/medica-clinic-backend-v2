import { Router } from "express";
import {
  addAppointmentVitals,
  addVitalsFromVeyetals,
  getAppointmentVitals,
  getPatientVitals,
  getVeyetalVitals,
  patientVitalChart,
} from "../controllers/appointment-vitals-controller.js";

const appointmentVitalRoutes = Router();

appointmentVitalRoutes.post("/save-vitals", addAppointmentVitals);
appointmentVitalRoutes.post("/get-vitals", getAppointmentVitals);
appointmentVitalRoutes.post("/save-veyetals", addVitalsFromVeyetals);
appointmentVitalRoutes.post("/get-veyetals", getVeyetalVitals);
appointmentVitalRoutes.post("/get-patient-vitals", getPatientVitals);
appointmentVitalRoutes.post("/patient-vital-graph", patientVitalChart);


export default appointmentVitalRoutes;
