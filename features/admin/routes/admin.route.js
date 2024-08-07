import express from 'express';
import { check } from 'express-validator';
import AdminController from '../controllers/admin.controller.js';
import { isAuth } from '../../../middleware/auth.middleware.js';
const router = express.Router();

router.post(
  '/UsersGet',
  isAuth,
  [
    check('SearchBy').optional({ nullable: true }).isString(),
    check('FilterBy').optional({ nullable: true }).isString(),
    check('Page').isInt().not().isEmpty(),
    check('Limit').isInt().not().isEmpty(),
  ],
  AdminController.getUsers
);

router.post('/AnalyticsGet', isAuth, AdminController.getAnalytics);

export default router;
