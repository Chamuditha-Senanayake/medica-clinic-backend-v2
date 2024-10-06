import { Router } from "express";
import {getAppointmentRecords} from "../controllers/appointment-records-controller.js";

const appointmentRecordsRoutes = Router();
appointmentRecordsRoutes.post("/get", getAppointmentRecords);

export default appointmentRecordsRoutes;