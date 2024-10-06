import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const handleUploadedImageFile = async (req, res) => {
  try {
    const filename = req.file ? req.file.filename : null;

    if (!filename) {
      handleError(
        res,
        500,
        "error",
        "An error occurred while uploading the file",
        error
      );
    }

    handleResponse(res, 200, "success", "File uploaded successfully", filename);
  } catch (error) {
    return handleError(
      res,
      500,
      "error",
      "An error occurred while uploading the file",
      error
    );
  }
};
