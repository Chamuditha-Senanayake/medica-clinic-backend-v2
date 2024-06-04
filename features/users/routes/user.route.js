import express from 'express';
import { check } from 'express-validator';
import UserController from '../controllers/user.controller.js';
import AppConstants from '../../../config/constants.js';
import ResponseMessages from '../../../config/messages.js';
import { isAuth } from '../../../middleware/auth.middlewarw.js';

const router = express.Router();

router.post(
  '/Login',
  [
    check('Username').notEmpty().isString(),
    check('Password').notEmpty().isString(),
  ],
  UserController.login
);

router.post(
  '/Signup',
  [
    check('Username').notEmpty().isString(),
    check('Password').notEmpty().isString(),
    check('Gender').notEmpty().isString(),
    check('FName').notEmpty().isString(),
    check('LName').notEmpty().isString(),
    check('Dob').notEmpty().isDate(),
    check('Email').notEmpty().isString(),
    check('ContactNo').notEmpty().isString(),
  ],
  UserController.signup
);

router.post(
  '/Signup/Social',
  [
    check('Username').notEmpty().isString(),
    check('Token').notEmpty().isString(),
    check('Provider')
      .notEmpty()
      .withMessage('Provider is required.')
      .isIn(AppConstants.Providers)
      .withMessage(ResponseMessages.Provider.VALIDATION_ERROR),
    check('Gender').notEmpty().isString(),
    check('FName').notEmpty().isString(),
    check('LName').notEmpty().isString(),
    check('Dob').notEmpty().isDate(),
    check('Email').notEmpty().isString(),
    check('ContactNo').notEmpty().isString(),
  ],
  UserController.socialSignup
);

router.post(
  '/EmailVerify',
  [check('Email').notEmpty().isString()],
  UserController.verifyEmail
);

router.post(
  '/EmailAvailabilityCheck',
  [check('Email').notEmpty().isString()],
  UserController.getUserByEmail
);

router.post(
  '/UsernameAvailabilityCheck',
  [check('Username').notEmpty().isString()],
  UserController.getUserByUsername
);

router.post(
  '/ContactNoAvailabilityCheck',
  [check('ContactNo').notEmpty().isString()],
  UserController.getUserByContactNo
);

router.post(
  '/AddressGet',
  [check('UserId').notEmpty().isInt(), check('Id').notEmpty().isInt()],
  UserController.getAddress
);

router.post(
  '/AddressSave',
  [
    check('AddressLine1').notEmpty().isString().isLength({ max: 75 }),
    check('AddressLine2')
      .optional({ values: 'null' })
      .isString()
      .isLength({ max: 75 }),
    check('Suburb')
      .optional({ values: 'null' })
      .isString()
      .isLength({ max: 75 }),
    check('City').optional({ values: 'null' }).isString().isLength({ max: 75 }),
    check('Postcode')
      .optional({ values: 'null' })
      .isString()
      .isLength({ max: 75 }),
    check('Country')
      .optional({ values: 'null' })
      .isString()
      .isLength({ max: 75 }),
    check('Status').optional({ values: 'null' }).isInt(),
    check('UserSaved').notEmpty().isInt(),
    check('Id').optional({ values: 'null' }).isInt(),
    check('LocalTran').optional({ values: 'null' }).isString(),
    check('OperationUniqueId').optional({ values: 'null' }).isString(),
  ],
  UserController.saveAddress
);

router.post(
  '/DeleteRecord',
  [
    check('Id').notEmpty().isInt(),
    check('Table').notEmpty().isString(),
    check('UserId').notEmpty().isInt(),
  ],
  UserController.deleteRecord
);

router.post(
  '/OCRSaves',
  [
    check('UUID').optional({ values: 'null' }).isString(),
    check('RefrenceNo').optional({ values: 'null' }).isString(),
    check('OCRResult').optional({ values: 'null' }).isString(),
    check('UserSaved').notEmpty().isInt(),
    check('Id').optional({ values: 'null' }).isInt(),
    check('UserId').optional({ values: 'null' }).isInt(),
  ],
  UserController.ocrSaves
);

router.post(
  '/Authenticate',
  [
    check('UserName').optional({ values: 'null' }).isString(),
    check('Password').optional({ values: 'null' }).isString(),
    check('RememberMe').optional({ values: 'null' }).isInt(),
    check('AccessToken').optional({ values: 'null' }).isString(),
    check('UserAgent').optional({ values: 'null' }).isString(),
  ],
  UserController.authenticate
);

router.post(
  '/OTPCheck',
  [
    check('Mobile').notEmpty().isString().isLength({ max: 15 }),
    check('OTP').notEmpty().isInt(),
  ],
  UserController.checkOTP
);

router.post(
  '/OTPGet',
  [
    check('Mobile')
      .optional({ values: 'null' })
      .isString()
      .isLength({ max: 15 }),
    check('PatientId').optional({ values: 'null' }).isInt(),
  ],
  UserController.getOTP
);

router.post(
  '/PasswordReset',
  [
    check('Email').notEmpty().isString(),
    check('Password').notEmpty().isString(),
    check('Token').notEmpty().isString(),
  ],
  UserController.userResetPassword
);

router.post('/ProfileGet', isAuth, UserController.getProfile);

router.post(
  '/BasicProfileInfoUpdate',
  isAuth,
  [
    check('Id').notEmpty().isInt(),
    check('FName').optional({ nullable: true }).isString(),
    check('MName').optional({ nullable: true }).isString(),
    check('LName').optional({ nullable: true }).isString(),
    check('Occupation').optional({ nullable: true }).isString(),
    check('SSN').optional({ nullable: true }).isString(),
    check('NIC').optional({ nullable: true }).isString(),
    check('Passport').optional({ nullable: true }).isString(),
    check('Email').optional({ nullable: true }).isString(),
    check('ProfileImage').optional({ nullable: true }).isString(),

    check('PrimaryContact').optional({ nullable: true }).isString(),
    check('SecondaryContact').optional({ nullable: true }).isString(),

    check('Country').optional({ nullable: true }).isString(),
    check('Address').optional({ nullable: true }).isString(),
    check('City').optional({ nullable: true }).isString(),
    check('Postcode').optional({ nullable: true }).isString(),
  ],
  UserController.updateBasicProfileInfo
);

router.post(
  '/PersonalProfileInfoUpdate',
  isAuth,
  [
    check('Id').notEmpty().isInt(),
    check('Gender').optional({ nullable: true }).isString(),
    check('Dob').optional({ nullable: true }).isString(),
    check('CivilStatus').optional({ nullable: true }).isString(),
    check('Ethnicity').optional({ nullable: true }).isString(),
    check('Weight').optional({ nullable: true }).isInt(),
    check('Height').optional({ nullable: true }).isInt(),
    check('SocialProfile').optional({ nullable: true }).isArray(),
  ],
  UserController.updatePersonalProfileInfo
);

router.post('/UserProfileInfoGet', isAuth, UserController.getUserProfileInfo);

export default router;
