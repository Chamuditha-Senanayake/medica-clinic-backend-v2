import { Router } from "express";
import {
  getMedicalCertificate,
  saveMedicalCertificate,
} from "../controllers/medical-certificate-controller.js";

const medicalCertificateRoutes = Router();

medicalCertificateRoutes.post("/save", saveMedicalCertificate);
medicalCertificateRoutes.post("/get", getMedicalCertificate);

export default medicalCertificateRoutes;
