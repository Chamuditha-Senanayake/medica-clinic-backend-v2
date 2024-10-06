import { Router } from "express";
import {
    instituteAllDoctors,
    instituteBranchDoctorAssignGet, instituteBranchDoctorGet, instituteBranchDoctorSave,
    instituteBranchNurseGet,
    instituteBranchSave, instituteBranchWardGet, instituteGet, instituteOrderedBranchGet, instituteSave,
    searchInstitutes
} from "../controllers/institute-controller.js";
import {instituteBranchGet} from "../controllers/institute-branch-controller.js";

const institutesRoutes = Router();

institutesRoutes.post("/search-institutes", searchInstitutes);


institutesRoutes.post(`/institute-branch/save`, instituteBranchSave);

institutesRoutes.post(`/institute-branch/nurse/get`, instituteBranchNurseGet);

institutesRoutes.post(
    `/institute-branch/doctor-assigns/get/`,
    instituteBranchDoctorAssignGet
);


institutesRoutes.post(`/institute/get-institute`, instituteGet);

institutesRoutes.post(`/institute/save-institute`, instituteSave);

institutesRoutes.post(
    `/institute-branch/get-all-doctors`,
    instituteAllDoctors
);

institutesRoutes.post(`/institute-branch-doctor/save`, instituteBranchDoctorSave);

institutesRoutes.post(`/institute-branch-doctor/get`, instituteBranchDoctorGet);

institutesRoutes.post(`/institute-branch-ward/get`, instituteBranchWardGet);


institutesRoutes.post(`/institutes-and-branch/get`,instituteBranchGet);

institutesRoutes.post(
    `/intstitutes/ordered-branch-get`,
    instituteOrderedBranchGet
);


export default institutesRoutes;
