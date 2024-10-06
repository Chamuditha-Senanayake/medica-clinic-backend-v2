import multer from "multer";
import fs from "fs";
import { UPLOADED_FILES_FOLDER_PATH } from "../constants/shared-constants.js";
import { UPLOAD_FILE_TYPES } from "../constants/upload-file-types.js";
import handleError from "../utils/handleError.js";

// Configure Multer storage

export const handleMulterErrorMiddleware = (err, req, response, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === "LIMIT_FILE_SIZE") {
      return handleError(
        response,
        400,
        "error",
        "Max upload file size exceeded.",
        err
      );
    } else {
      return handleError(response, 500, "error", "An unknown error occurred.", err);
    }
  } else if (err) {
    // An unknown error occurred
    return handleError(response, 500, "error", "An unknown error occurred.", err);
  } else {
    next();
  }
};

const fileFilter = ({ allowedFileTypes = [] }) => {
  return (req, file, cb) => {
    // Check if the file type is in the allowed file types
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.error = "File type not allowed";
      cb(null, false);
    }
  };
};

const uploadFile = ({
  folderPath,
  allowedFileTypes = [...Object.values(UPLOAD_FILE_TYPES)],
  maxFileSizeMb = 5,
}) => {
  const fileSizeLimit = maxFileSizeMb * 1024 * 1024;
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        const targetDir = `${__dirname}${UPLOADED_FILES_FOLDER_PATH}${folderPath}/`;
        // Ensure the directory exists, otherwise create it
        fs.mkdirSync(targetDir, { recursive: true });
        callback(null, targetDir);
      },
      filename: function (req, file, callback) {
        const fileName = req.params.instituteBranchId;
        const extension = file.originalname.split(".").pop().toLowerCase();
        callback(null, fileName + "." + extension);

      },
    });
    return multer({
      storage: storage,
      fileFilter: fileFilter({ allowedFileTypes }),
      limits: { fileSize: fileSizeLimit },
    });
  } catch (ex) {
    console.log("here");
    console.error("Error:", ex);
  }
};

export default uploadFile;
