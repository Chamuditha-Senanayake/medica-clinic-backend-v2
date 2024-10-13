import { Router } from "express";
import {
  getInvestigationsByDoctorAndPatientId,
  getInvestigationsByPrescription,
  handleUploadedFile,
  saveInvestigationResults,
} from "../controller/investigation-controller.js";
import uploadFile from "../../../middleware/upload-middleware-v2.js";
import { INVESTIGATION_RESULTS_DOCUMENTS_FOLDER_PATH } from "../../../constants/shared-constants.js";
import path from "path";

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const fileTypes = /jpeg|jpg|png|pdf/;
  // Check file extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME type
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only images are allowed!");
  }
};

const investigationResultsDocumentUploadMiddleware = uploadFile({
  folderPath: INVESTIGATION_RESULTS_DOCUMENTS_FOLDER_PATH,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const investigationRoutes = Router();

investigationRoutes.post("/save", saveInvestigationResults);
investigationRoutes.post(
  "/get-investigations-by-prescription",
  getInvestigationsByPrescription
);

investigationRoutes.post(
  "/get-investigations-by-doctor-and-patient-id",
  getInvestigationsByDoctorAndPatientId
);

investigationRoutes.post(
  "/upload-investigation-results-document",
  investigationResultsDocumentUploadMiddleware.single("file"),
  handleUploadedFile
);

export default investigationRoutes;
