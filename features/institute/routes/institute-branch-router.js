import { Router } from "express";
import {
  instituteBranchGet,
  paymentOptionGet,
  paymentOptionSave,
} from "../controllers/institute-branch-controller.js";
import uploadFile from "../../../middleware/upload-middleware-v2.js";
import { UPLOAD_FILE_TYPES } from "../../../constants/upload-file-types.js";
import {
  INSTITUTE_BRANCH_IMAGE_FOLDER_PATH,
  MAX_IMAGE_FILE_SIZE_MB,
} from "../../../constants/shared-constants.js";
import { handleUploadedImageFile } from "../../general/controller/general-controller.js";

const instituteBranchRoutes = Router();

const instituteBranchLogoUploadMiddleware = uploadFile({
  folderPath: INSTITUTE_BRANCH_IMAGE_FOLDER_PATH,
  allowedFileTypes: [UPLOAD_FILE_TYPES.IMAGE_PNG],
  maxFileSizeMb: MAX_IMAGE_FILE_SIZE_MB,
});

instituteBranchRoutes.post("/payment-option-save", paymentOptionSave);
instituteBranchRoutes.post("/payment-option-get", paymentOptionGet);
instituteBranchRoutes.post("/get", instituteBranchGet);

instituteBranchRoutes.post(
  "/upload-institute-branch-logo/:instituteBranchId",
  instituteBranchLogoUploadMiddleware.single("file"),
  handleUploadedImageFile
);

export default instituteBranchRoutes;
