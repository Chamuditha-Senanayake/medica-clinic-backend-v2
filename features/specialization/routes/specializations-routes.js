import {Router} from "express";
import {
    getAllSpecialization,
    getSpecializationsByInstituteBranch,
    updateSpecialization
} from "../controller/specializations-controller.js";

const specializationsRoutes = Router();

specializationsRoutes.post(
    "/by-institute-branch",
    getSpecializationsByInstituteBranch
);

specializationsRoutes.post(
    `/specialization/update-specialization`,
    updateSpecialization
);

specializationsRoutes.post(`/specialization`,
    getAllSpecialization);


export default specializationsRoutes;
