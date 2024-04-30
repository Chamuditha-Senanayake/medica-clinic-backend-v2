import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { sendEmailFromCustomAccount } from "../../../utils/sendMail.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString,
} from "../../../utils/type-def.js";
import { google } from "googleapis";


const UserController = {
  /**
   *
   * Login
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async login(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }
    try {
      let connection = request.app.locals.db;
      const { Username, Password } = request.body;
      
      var params = [
        StringValue({ fieldName: "Username", value: Username }),
        StringValue({ fieldName: "Password", value: Password }),
      ];

      let userLoginResult = await executeSp({
        spName: `UserLogin`,
        params: params,
        connection,
      });

      userLoginResult = userLoginResult.recordsets[0][0];

      let token = jwt.sign(
        {
          userId: userLoginResult.Id,
          username: userLoginResult.Username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        }
      );

      userLoginResult.token = token;

      handleResponse(
        response,
        200,
        "success",
        "User logged successfully",
        userLoginResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Signup
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async signup(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }
    try {
      let connection = request.app.locals.db;
      const {
        Id = 0,
        Username,
        Password,
        UserGroupId = 5,
        Gender,
        FName,
        LName,
        Dob,
        Email,
        ContactNo,
        Status = 1,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "Username", value: Username }),
        StringValue({ fieldName: "Password", value: Password }),
        EntityId({ fieldName: "UserGroupId", value: UserGroupId }),
        StringValue({ fieldName: "Gender", value: Gender }),
        StringValue({ fieldName: "FName", value: FName }),
        StringValue({ fieldName: "LName", value: LName }),
        DateString({ fieldName: "Dob", value: Dob }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "ContactNo", value: ContactNo }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
      ];

      let userSaveResult = await executeSp({
        spName: `UserSave`,
        params: params,
        connection,
      });

      userSaveResult = userSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "User saved successfully",
        userSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Social Signup
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async socialSignup(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }
    try {
      let connection = request.app.locals.db;
      let {
        Id = 0,
        Username,
        Token,
        Provider,
        UserGroupId = 5,
        Gender,
        FName,
        LName,
        Dob,
        Email,
        ContactNo,
        Status = 1,
      } = request.body;

      switch (Provider) {
        case "google":
          await getGoogleUserEmail(Token);
          break;

        case "apple":
          console.log("Provider is 'apple'");
          break;
        case "microsoft":
          console.log("Provider is 'microsoft'");
          break;
        default:
          console.log("Provider is not recognized");
          break;
      }

      async function getGoogleUserEmail(token) {
        return new Promise((resolve, reject) => {
          const oauth2Client = new google.auth.OAuth2();
          oauth2Client.setCredentials({ access_token: token });
          google.oauth2("v2").userinfo.get(
            {
              auth: oauth2Client,
            },
            (err, response) => {
              if (err) {
                console.error("The API returned an error: " + err);
                reject(err);
              } else {
                Email = response.data.email;
                resolve(response.data.email);
              }
            }
          );
        });
      }

      async function getAppleUserEmail(token) {}

      async function getMicrosoftUserEmail(token) {}

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "Username", value: Username }),
        EntityId({ fieldName: "UserGroupId", value: UserGroupId }),
        StringValue({ fieldName: "Gender", value: Gender }),
        StringValue({ fieldName: "FName", value: FName }),
        StringValue({ fieldName: "LName", value: LName }),
        DateString({ fieldName: "Dob", value: Dob }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "ContactNo", value: ContactNo }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
      ];

      console.log(Email);
      let userSaveResult = await executeSp({
        spName: `UserSave`,
        params: params,
        connection,
      });

      userSaveResult = userSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "User saved successfully",
        userSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Verify email
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async verifyEmail(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }
    try {

      let connection = request.app.locals.db;
      const { Email } = request.body;

      var params = [
        StringValue({ fieldName: "Email", value: Email }),
      ];

      let userData = await executeSp({
        spName: `UserGetByEmail`,
        params: params,
        connection,
      });   

      if(!userData){
        throw Error;
      }

      let token = jwt.sign(
        {
          userId: userData.recordsets[0][0].Id,
          username: userData.recordsets[0][0].Username,
          email: userData.recordsets[0][0].Email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRATION_TIME,
        }
      );

      sendEmailFromCustomAccount({
        emailUser: "mms.dim.kln@gmail.com",
        emailPassword: "gqikpkwktknpalod",
        to: Email,   //chamudithacbs@gmail.com  //sithumdashantha@gmail.com
        subject:"Reset Password",
        html:`<h2>Verify Your Email</h2><p>Click the link below to reset your password:</p><a href='${process.env.FRONTEND_URL}/forgot-password?token=${token}'>${process.env.FRONTEND_URL}/forgot-password?token=${token}</a>`
      })

      handleResponse(
        response,
        200,
        "success",
        "Verification email sent",
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Get user by email
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getUserByEmail(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    let userGetByEmailResult;

    try {
      let connection = request.app.locals.db;
      const { Email } = request.body;

      var params = [StringValue({ fieldName: "Email", value: Email })];

      userGetByEmailResult = await executeSp({
        spName: `UserGetByEmail`,
        params: params,
        connection,
      });   
      
      userGetByEmailResult = {Availabillity: false};

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        userGetByEmailResult
      );
    } catch (error) {
        userGetByEmailResult = {Availabillity: true};
        handleResponse(
          response,
          200,
          "success",
          "Data retrived successfully",
          userGetByEmailResult
        );
    }
  },

  /**
   *
   * Get user by username
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getUserByUsername(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    let userGetByUsernameResult;

    try {
      let connection = request.app.locals.db;
      const { Username } = request.body;

      var params = [StringValue({ fieldName: "Username", value: Username })];

      userGetByUsernameResult = await executeSp({
        spName: `UserGetByUsername`,
        params: params,
        connection,
      });   
      
      userGetByUsernameResult = {Availabillity: false};

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        userGetByUsernameResult
      );
    } catch (error) {
        userGetByUsernameResult = {Availabillity: true};
      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        userGetByUsernameResult
      );
    }
  },

  /**
   *
   * Get user by contact number
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getUserByContactNo(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    let userGetByContactNoResult;

    try {
      let connection = request.app.locals.db;
      const { ContactNo } = request.body;

      var params = [StringValue({ fieldName: "ContactNo", value: ContactNo })];

      let userGetByContactNoResult = await executeSp({
        spName: `UserGetByContactNo`,
        params: params,
        connection,
      });   
      
      userGetByContactNoResult = {Availabillity: false};

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        userGetByContactNoResult
      );
    } catch (error) {
      userGetByContactNoResult = {Availabillity: true};
      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        userGetByContactNoResult
      );
      // next(error);
    }
  },

  /**
   *
   * Get addresses
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getAddress(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, Id } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let addressGetResult = await executeSp({
        spName: `AddressGet`,
        params: params,
        connection,
      });

      addressGetResult = addressGetResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Address retrived successfully",
        addressGetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Save addresses
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async saveAddress(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }
    try {
      let connection = request.app.locals.db;
      const {
        AddressLine1,
        AddressLine2 = "",
        Suburb = "",
        City = "",
        Postcode = "",
        Country = "",
        Status = 0,
        UserSaved,
        Id = 0,
        LocalTran = "",
        OperationUniqueId = "",
      } = request.body;

      var params = [
        StringValue({ fieldName: "AddressLine1", value: AddressLine1 }),
        StringValue({ fieldName: "AddressLine2", value: AddressLine2 }),
        StringValue({ fieldName: "Suburb", value: Suburb }),
        StringValue({ fieldName: "City", value: City }),
        StringValue({ fieldName: "Postcode", value: Postcode }),
        StringValue({ fieldName: "Country", value: Country }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({
          fieldName: "UserSaved",
          value: UserSaved,
        }),
        EntityId({
          fieldName: "Id",
          value: Id,
        }),
        StringValue({ fieldName: "LocalTran", value: LocalTran }),

        StringValue({
          fieldName: "OperationUniqueId",
          value: OperationUniqueId,
        }),
      ];

      let addressSaveResult = await executeSp({
        spName: `AddressSave`,
        params: params,
        connection,
      });

      addressSaveResult = addressSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Address saved successfully",
        addressSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Delete records from a table
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async deleteRecord(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, Table, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "Table", value: Table }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let deleteRecordResult = await executeSp({
        spName: `DeleteRecord`,
        params: params,
        connection,
      });

      deleteRecordResult = deleteRecordResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Record deleted successfully",
        deleteRecordResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Save OCR
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async ocrSaves(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        UUID = "",
        RefrenceNo = "",
        OCRResult = "",
        UserSaved,
        Id = 0,
        UserId = 0,
      } = request.body;

      var params = [
        StringValue({ fieldName: "UUID", value: UUID }),
        StringValue({ fieldName: "RefrenceNo", value: RefrenceNo }),
        StringValue({ fieldName: "OCRResult", value: OCRResult }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let cCRSavesResult = await executeSp({
        spName: `OCRSaves`,
        params: params,
        connection,
      });

      cCRSavesResult = cCRSavesResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "OCR saved successfully",
        cCRSavesResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Authenticate User
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async authenticate(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        UserName = "",
        Password = "",
        RememberMe = 0,
        AccessToken = "",
        UserAgent = "",
      } = request.body;

      var params = [
        StringValue({ fieldName: "UserName", value: UserName }),
        StringValue({ fieldName: "Password", value: Password }),
        SignedInteger({
          fieldName: "RememberMe",
          value: RememberMe,
        }),
        StringValue({ fieldName: "AccessToken", value: AccessToken }),
        StringValue({ fieldName: "UserAgent", value: UserAgent }),
      ];

      let authenticateResult = await executeSp({
        spName: `Authenticate`,
        params: params,
        connection,
      });

      authenticateResult = authenticateResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "User authenticated successfully",
        authenticateResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Check OTP
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async checkOTP(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Mobile, OTP } = request.body;

      var params = [
        StringValue({ fieldName: "Mobile", value: Mobile }),

        EntityId({ fieldName: "OTP", value: OTP }),
      ];

      let OTPCheckResult = await executeSp({
        spName: `OTPCheck`,
        params: params,
        connection,
      });

      OTPCheckResult = OTPCheckResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "OTP data retrieved successfully",
        OTPCheckResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Get OTP
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getOTP(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Mobile = "", PatientId = 0 } = request.body;

      var params = [
        StringValue({ fieldName: "Mobile", value: Mobile }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
      ];

      let letOTPGetResult = await executeSp({
        spName: `OTPGet`,
        params: params,
        connection,
      });

      letOTPGetResult = letOTPGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "OTP data retrieved successfully",
        letOTPGetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * Rest Password
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async resetPassword(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.User.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId, Password } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        StringValue({ fieldName: "Password", value: Password }),
      ];

      let passwordResetResult = await executeSp({
        spName: `PasswordReset`,
        params: params,
        connection,
      });

      passwordResetResult = passwordResetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Password changed successfully",
        passwordResetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },
};

export default UserController;
