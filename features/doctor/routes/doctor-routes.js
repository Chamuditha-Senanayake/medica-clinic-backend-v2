import { Router } from "express";
import {
  assignSessionCategoryToDoctor, doctorServiceFeeGet, doctorServiceFeeSave, getByBranch, getByUser,
  getDoctorBio, getDoctorByInstitute, getDoctorInstitute,
  getDoctorSessionCategories, notifyNewAppointment,
  saveDoctorSpecialization,
  saveOrUpdateDoctor,
  setDoctorBio,
  setShowDoctorForOnlineBookingStatus,
} from "../controllers/doctor-controller.js";

const doctorRoutes = Router();

doctorRoutes.post("/set-doctor-bio", setDoctorBio);
doctorRoutes.post("/get-doctor-bio", getDoctorBio);
doctorRoutes.post(
  "/set-show-doctor-for-online-booking",
  setShowDoctorForOnlineBookingStatus
);
doctorRoutes.post("/assign-doctor-session-category", assignSessionCategoryToDoctor);
doctorRoutes.post("/get-doctor-session-categories", getDoctorSessionCategories);

doctorRoutes.post("/save-or-update", saveOrUpdateDoctor);

doctorRoutes.post("/save-specializations", saveDoctorSpecialization);

doctorRoutes.post(`/doctor/get-by-user`, getByUser);

doctorRoutes.post(`/doctor/get-by-branch`, getByBranch);

doctorRoutes.post(`/doctor-service-fee/save`, doctorServiceFeeSave);

doctorRoutes.get(`/doctor-service-fee/get/`, doctorServiceFeeGet);

doctorRoutes.post(`/doctor/notify-new-appointment`, notifyNewAppointment);

doctorRoutes.post(`/doctor/by-institute/get/`, getDoctorByInstitute);

doctorRoutes.post(`/doctor/institute/get/`, getDoctorInstitute);


export default doctorRoutes;
