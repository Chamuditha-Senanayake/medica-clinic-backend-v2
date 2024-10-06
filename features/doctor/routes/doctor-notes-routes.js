import { Router } from "express";
import { getDoctorSessionCategories } from "../controllers/doctor-controller.js";
import {
  doctorNoteGetByDoctorAndPatientId,
  doctorNoteSave,
} from "../controllers/doctor-note-controller.js";

const doctorNoteRoutes = Router();

doctorNoteRoutes.post("/doctor-note-save", doctorNoteSave);
doctorNoteRoutes.post("/get-doctor-notes", doctorNoteGetByDoctorAndPatientId);

export default doctorNoteRoutes;
