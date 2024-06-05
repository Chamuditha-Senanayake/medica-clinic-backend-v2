import express from 'express';
import { check } from 'express-validator';
import NoteController from '../controllers/note.controller.js';
const router = express.Router();

router.post(
  '/NoteGet',
  [
    check('Id').isInt().not().isEmpty(),
    check('PatientId').isInt().not().isEmpty(),
    check('UserId').not().isEmpty(),
  ],
  NoteController.getNote
);

router.post(
  '/NoteSave',
  [
    check('Id').isInt().not().isEmpty(),
    check('PatientId').isInt().not().isEmpty(),
    check('Note').not().isEmpty(),
    check('AgeYears').isInt().not().isEmpty(),
    check('AgeMonths').isInt().not().isEmpty(),
    check('Status').isInt().not().isEmpty(),
    check('UserSaved').isInt().not().isEmpty(),
  ],
  NoteController.saveNote
);

export default router;
