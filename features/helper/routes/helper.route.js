import express from 'express';
import { check } from 'express-validator';
import HelperController from '../controllers/helper.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAuthorizedHelper } from '../../../middleware/helper.middleware.js';
const router = express.Router();

router.post(
  '/HelperRequest',
  isAuth,
  isActiveUser,
  [
    check('HelperEmail').not().isEmpty().isString(),
    check('HelperName').optional({ nullable: true }).isString(),
    check('Status')
      .isIn(['invited', 'enabled', 'disabled', 'deleted'])
      .optional({ nullable: true })
      .isString(),
  ],
  HelperController.requestHelper
);

router.post(
  '/HelperRespond',
  isAuth,
  isActiveUser,
  [
    check('HelperEmail').not().isEmpty().isString(),
    check('Status')
      .isIn(['accepted', 'rejected'])
      .optional({ nullable: true })
      .isString(),
    check('Token').not().isEmpty().isString(),
  ],
  HelperController.respondHelper
);

router.post(
  '/HelperTokenValidation',
  isAuth,
  isActiveUser,
  [check('Token').not().isEmpty().isString()],
  HelperController.tokenValidation
);

router.post(
  '/HelperRequestPatientAccess',
  isAuth,
  isActiveUser,
  isAuthorizedHelper,
  [check('PatientId').isInt().not().isEmpty()],
  HelperController.issueHelperPatientToken
);

router.post(
  '/HelperPatientsGet',
  isAuth,
  isActiveUser,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('Page').optional({ nullable: true }).isInt(),
    check('Limit').optional({ nullable: true }).isInt(),
  ],
  HelperController.getHelperPatients
);

export default router;
