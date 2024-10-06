import { Router } from "express";
import {
  appointmentsToday,
  bookingsByType,
  patientRegistrations,
  patientsToday,
  totalCollections,
} from "../controllers/analytics-controller.js";

const analyticsRoutes = Router();

analyticsRoutes.post("/appointments-today", appointmentsToday);
analyticsRoutes.post("/patients-today", patientsToday);
analyticsRoutes.post("/patient-registartions", patientRegistrations);
analyticsRoutes.post("/total-collections", totalCollections);
analyticsRoutes.post("/bookings-by-type", bookingsByType);

export default analyticsRoutes;
