import express from 'express';
import { check } from 'express-validator';
// import FileHandlerController from '../controllers/fileHandler.controller.js';
import upload from '../../../middleware/upload.middleware.js';
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

// Route to handle file uploads
router.post('/FileUpload', upload.single('File'), (req, res) => {
  try {
    const resourceName = req.ResourceName;
    const file = req.file;

    if (!file) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }

    res.status(200).send({
      message: 'File uploaded successfully!',
      file: req.file,
      resourceName: resourceName,
    });
  } catch (err) {
    res.status(500).send({ message: 'Could not upload the file.', error: err });
  }
});

export default router;
