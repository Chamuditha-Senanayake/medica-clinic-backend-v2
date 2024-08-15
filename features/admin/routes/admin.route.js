import express from 'express';
import { check } from 'express-validator';
import AdminController from '../controllers/admin.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
import { isActiveUser } from '../../../middleware/activityCheck.middleware.js';
import { isAdmin } from '../../../middleware/admin.middleware.js';
const router = express.Router();

router.post(
  '/UsersGet',
  isAuth,
  isActiveUser,
  isAdmin,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('FilterBy').optional({ nullable: true }).isString(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  AdminController.getUsers
);

router.post(
  '/UserRoleUpdate',
  isAuth,
  isActiveUser,
  isAdmin,
  [
    check('UserId').isInt().not().isEmpty(),
    check('UserRoleId').isInt().not().isEmpty(),
  ],
  AdminController.updateUserRole
);

router.post(
  '/UserStatusUpdate',
  isAuth,
  isActiveUser,
  isAdmin,
  [
    check('UserId').isInt().not().isEmpty(),
    check('UserStatus').isString().not().isEmpty(),
  ],
  AdminController.updateUserStatus
);

router.post(
  '/AnalyticsGet',
  isAuth,
  isActiveUser,
  isAdmin,
  AdminController.getAnalytics
);

export default router;
