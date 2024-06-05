import express from 'express';
import { check } from 'express-validator';
// import FileHandlerController from '../controllers/fileHandler.controller.js';
import upload from '../../../middleware/upload.middleware.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// router.post(
//   '/NoteGet',
//   [
//     check('Id').isInt().not().isEmpty(),
//     check('PatientId').isInt().not().isEmpty(),
//     check('UserId').not().isEmpty(),
//   ],
//   NoteController.getNote
// );

router.post('/FileUpload', isAuth, upload.single('File'), (req, res) => {
  try {
    const resourceName = req.ResourceName;
    const file = req.file;

    if (!file) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    res.status(200).send({
      message: 'File uploaded successfully!',
      file: req.file,
    });
  } catch (err) {
    res.status(500).send({ message: 'Could not upload the file.', error: err });
  }
});

export default router;
