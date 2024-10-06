import { Router } from "express";
import {
    appVersion,
    getAppVersion,
    inwardBedSave,
    nurseInstituteBranchWardSave,
    saveAppVersion
} from "../controller/app-version-controller.js";

const appVersionRoutes = Router();

appVersionRoutes.post("/get", getAppVersion);
appVersionRoutes.post("/save", saveAppVersion);
appVersionRoutes.post("/app-version", appVersion);

appVersionRoutes.post(`/ward-bed/save`, inwardBedSave);
appVersionRoutes.post(`/ward/assign-nurse`, nurseInstituteBranchWardSave);



export default appVersionRoutes;
