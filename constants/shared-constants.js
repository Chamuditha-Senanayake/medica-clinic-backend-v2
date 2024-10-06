//this file exports shared constatnts that are used in multiple files
import dotenv from "dotenv";

dotenv.config();

export const UPLOADED_FILES_FOLDER_PATH =
  process.env.UPLOADED_FILES_FOLDER_PATH;

export const INVESTIGATION_RESULTS_DOCUMENTS_FOLDER_PATH =
  process.env.INVESTIGATION_RESULTS_DOCUMENTS_FOLDER_PATH;

export const MAX_IMAGE_FILE_SIZE_MB = process.env.MAX_IMAGE_FILE_SIZE_MB;

export const INSTITUTE_BRANCH_IMAGE_FOLDER_PATH =
  process.env.INSTITUTE_BRANCH_IMAGE_FOLDER_PATH;
