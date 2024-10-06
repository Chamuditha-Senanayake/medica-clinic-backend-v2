import multer from "multer";
import fs from "fs";
import { UPLOADED_FILES_FOLDER_PATH } from "../constants/shared-constants.js";
import handleError from "../utils/handleError.js";

// Configure Multer storage

const uploadFile = ({ folderPath, fileFilter, limits }) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, callback) {
        const targetDir = `${__dirname}${UPLOADED_FILES_FOLDER_PATH}${folderPath}/`;
        // Ensure the directory exists, otherwise create it
        fs.mkdirSync(targetDir, { recursive: true });
        callback(null, targetDir);
      },
      filename: function (req, file, callback) {
        const extension = file.originalname.split(".").pop().toLowerCase();
        let fileName = file.originalname.slice(0, -extension.length - 1);
        //add a random string to the file name
        const randomValue = Math.floor(Math.random() * 1000000000);
        fileName = fileName + "-" + randomValue;
        callback(null, fileName + "-" + Date.now() + "." + extension);
      },
    });
    return multer({ storage: storage, fileFilter, limits });
  } catch (ex) {
    console.error("Error:", ex);
    throw ex;
  }
};

export default uploadFile;
