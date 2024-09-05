// import express from 'express';
// import { check } from 'express-validator';
// import DiagnosisController from '../controllers/diagnosis.controller.js';
// import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
// import { isAuth } from '../../../middleware/auth.middleware.js';
// const router = express.Router();

// router.post(
//   '/NoteGet',
//   isAuth,
//   isActiveUser,
//   [
//     check('Id').isInt().not().isEmpty(),
//     check('PatientId').isInt().not().isEmpty(),
//     check('UserId').not().isEmpty(),
//   ],
//   DiagnosisController.getNote
// );

// router.post(
//   '/NoteSave',
//   isAuth,
//   isActiveUser,
//   [
//     check('Id').isInt().not().isEmpty(),
//     check('PatientId').isInt().not().isEmpty(),
//     check('Note').not().isEmpty(),
//     check('AgeYears').isInt().not().isEmpty(),
//     check('AgeMonths').isInt().not().isEmpty(),
//     check('Status').isInt().not().isEmpty(),
//     check('UserSaved').isInt().not().isEmpty(),
//   ],
//   DiagnosisController.saveNote
// );

// export default router;
