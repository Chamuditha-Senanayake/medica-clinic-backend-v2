import multer from "multer";

export const uploadImage = multer({
  limits: {
    fileSize: 10000000, // 10MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});
