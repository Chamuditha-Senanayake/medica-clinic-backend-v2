import express from 'express';
import { check } from 'express-validator';
import DrugController from '../controllers/drug.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
const router = express.Router();

router.post(
  '/DrugsGetByName',
  isAuth,
  isActiveUser,
  check('DrugName').optional({ nullable: true }).isString(),
  DrugController.getDrugsByName
);

router.post(
  '/DrugAllergyGet',
  isAuth,
  isActiveUser,
  [check('Id').isInt().not().isEmpty(), check('UserId').not().isEmpty()],
  DrugController.getDrugAllergy
);

router.post(
  '/DrugAllergySave',
  isAuth,
  isActiveUser,
  [
    check('Id').isInt().not().isEmpty(),
    check('Name').not().isEmpty(),
    check('Status').isInt().not().isEmpty(),
    check('UserSaved').isInt().not().isEmpty(),
  ],
  DrugController.saveDrugAllergy
);

router.post(
  '/DrugCountGet',
  isAuth,
  isActiveUser,
  [
    check('UserId').isInt().not().isEmpty(),
    check('DoctorId').isInt().not().isEmpty(),
    check('DateFrom').not().isEmpty(),
    check('DateTo').not().isEmpty(),
  ],
  DrugController.getDrugCount
);

router.post(
  '/DrugGet',
  isAuth,
  isActiveUser,
  [
    check('Id').isInt().not().isEmpty(),
    check('UserId').isInt().not().isEmpty(),
    check('Source').not().isEmpty(),
  ],
  DrugController.getDrug
);

router.post(
  '/DrugSave',
  isAuth,
  isActiveUser,
  [
    check('Id').isInt().not().isEmpty(),
    check('RawName').not().isEmpty(),
    check('GenericName').not().isEmpty(),
    check('TradeName').not().isEmpty(),
    check('DrugTypeId').isInt().not().isEmpty(),
    check('Weight').isFloat().not().isEmpty(),
    check('WeightType').not().isEmpty(),
    check('Status').isInt().not().isEmpty(),
    check('UserSaved').isInt().not().isEmpty(),
    check('Source').not().isEmpty(),
    check('Description').not().isEmpty(),
  ],
  DrugController.saveDrug
);

router.post(
  '/DrugStatusSwitch',
  isAuth,
  isActiveUser,
  [
    check('Id').isInt().not().isEmpty(),
    check('UserId').isInt().not().isEmpty(),
    check('Active').isInt().not().isEmpty(),
  ],
  DrugController.switchDrugStatus
);

router.post(
  '/DrugTemplateGet',
  isAuth,
  isActiveUser,
  [
    check('Id').isInt().not().isEmpty(),
    check('UserId').isInt().not().isEmpty(),
  ],
  DrugController.getDrugTemplate
);

router.post(
  '/DrugTemplateSave',
  isAuth,
  isActiveUser,
  [
    check('Id').isInt().not().isEmpty(),
    check('DoctorId').isInt().not().isEmpty(),
    check('Name').not().isEmpty(),
    check('Status').isInt().not().isEmpty(),
    check('UserSaved').isInt().not().isEmpty(),
  ],
  DrugController.saveDrugTemplate
);

export default router;
