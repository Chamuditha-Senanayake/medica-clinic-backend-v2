import { Router } from "express";
import {
  addNewSessionCategory,
  deleteSession,
  getSessionByDoctorAndInstituteBranch,
  getSessionCategories,
  getSessionCategoryBySessionId,
  getSessionsByDateRange,
  getSessionsFromAllDoctors,
  getSessionsFromAllDoctorsV2,
  saveOrUpdateSession,
  sessionsByDoctorGet, sessionsByInstitute,
  sessionsByInstituteBranchGet,
  sessionsByInstituteGet, sessionsToday, sessionsTodayV2,
} from "../controller/session-controller.js";

const sessionRoutes = Router();

sessionRoutes.post("/get-by-date-range", getSessionsByDateRange);
sessionRoutes.post("/get-sessions-from-all-doctors", getSessionsFromAllDoctors);
sessionRoutes.post(
  "/get-sessions-from-all-doctorsv2",
  getSessionsFromAllDoctorsV2
);
sessionRoutes.post("/add-new-session-category", addNewSessionCategory);
sessionRoutes.post("/get-session-categories", getSessionCategories);
sessionRoutes.post("/save-or-update", saveOrUpdateSession);
sessionRoutes.post(
  "/get-sessions-by-doctor-and-institute-branch",
  getSessionByDoctorAndInstituteBranch
);
sessionRoutes.post(
  "/get-category-by-session-id",
  getSessionCategoryBySessionId
);
sessionRoutes.post("/delete-session", deleteSession);
sessionRoutes.post("/get-sessions-by-institute", sessionsByInstituteGet);
sessionRoutes.post("/get-sessions-by-doctor", sessionsByDoctorGet);
sessionRoutes.post("/get-sessions-by-branch", sessionsByInstituteBranchGet);

sessionRoutes.post(`/sessions/sessions-today`, sessionsToday);

sessionRoutes.post(`/sessions/sessions-todayv2`, sessionsTodayV2);

sessionRoutes.post(`/get-sessions-by-institute`, sessionsByInstitute);

export default sessionRoutes;
