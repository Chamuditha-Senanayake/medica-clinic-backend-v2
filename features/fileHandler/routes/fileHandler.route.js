import express from 'express';
import { check } from 'express-validator';
// import FileHandlerController from '../controllers/fileHandler.controller.js';
import upload from '../../../middleware/upload.middleware.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';

const router = express.Router();

router.post(
  '/FileUpload',
  isAuth,
  isActiveUser,
  upload.single('File'),
  (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).send({ message: 'Please upload a file!' });
      }

      res.status(200).send({
        message: 'File uploaded successfully!',
        file: req.file,
      });
    } catch (err) {
      res
        .status(500)
        .send({ message: 'Could not upload the file.', error: err });
    }
  }
);

export default router;
