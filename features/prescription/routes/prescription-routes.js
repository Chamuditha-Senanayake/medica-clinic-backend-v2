import { Router } from "express";
import {
  generatePrescriptionFileName,
  getPrescriptionFileName,
  getVitalsFromLastPrescription,
  prescriptionsByInstituteBranchId,
  prescriptionsByPatient,
  savePrescriptionRecord,
  sendPrescriptionViaEmail,
  updatePrescriptionApprovalStatus,
} from "../controllers/prescription-controller.js";

const prescriptionRoutes = Router();

prescriptionRoutes.post(
  "/get-prescriptions-by-patient",
  prescriptionsByPatient
);
prescriptionRoutes.post(
  "/get-prescriptions-by-institute-branch",
  prescriptionsByInstituteBranchId
);

prescriptionRoutes.post(
  "/get-prescriptions-file-name",
  getPrescriptionFileName
);

prescriptionRoutes.post(
  "/generate-prescription-file-name",
  generatePrescriptionFileName
);

prescriptionRoutes.post(
  "/send-prescription-via-email",
  sendPrescriptionViaEmail
);

prescriptionRoutes.post(
  "/get-vitals-from-last-prescription",
  getVitalsFromLastPrescription
);

prescriptionRoutes.post(
  "/update-prescription-approval-status",
  updatePrescriptionApprovalStatus
);

prescriptionRoutes.post("/prescription-record-save", savePrescriptionRecord);

export default prescriptionRoutes;
