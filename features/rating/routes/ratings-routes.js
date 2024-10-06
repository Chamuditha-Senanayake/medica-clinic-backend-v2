import { Router } from "express";
import { getAppointmentRatings, getInstituteBranchRatings, saveAppointmentRatings, saveInstituteBranchRatings } from "../controller/ratings-controller.js";


const ratingRoutes = Router();

ratingRoutes.post("/save-appointment-rating", saveAppointmentRatings);
ratingRoutes.post("/save-insitute-branch-rating", saveInstituteBranchRatings);
ratingRoutes.post("/get-appointment-ratings", getAppointmentRatings);
ratingRoutes.post("/get-institute-branch-ratings", getInstituteBranchRatings);


export default ratingRoutes;
