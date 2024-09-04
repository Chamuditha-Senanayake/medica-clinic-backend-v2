import { validationResult } from "express-validator";
import jwtSign from "../../../utils/jwtSign.js";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { sendEmailFromCustomAccount } from "../../../utils/sendMail.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  TableValueParameters,
  DateString,
} from "../../../utils/type-def.js";
import jwt from "jsonwebtoken";
import sql from "mssql";
import bcrypt from "bcrypt";
import { getToken, refreshTokenGAS } from "../../../utils/gas.js";

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

      let token = jwtSign({
        userId: userLoginResult.Id,
        username: userLoginResult.Username,
        email: userLoginResult.Email,
      });

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
        spName: `UserGetByEmail`, //UserEmailGet
        params: params,
        connection,
      });

      userGetByEmailResult = { Availability: true };

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        userGetByEmailResult
      );
    } catch (error) {
      userGetByEmailResult = { Availability: false };
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

      var params = [StringValue({ fieldName: "Email", value: Email })];

      let userData = await executeSp({
        spName: `UserGetByEmail`,
        params: params,
        connection,
      });

      if (!userData) {
        throw Error("User not found");
      }

      let token = jwtSign(
        {
          userId: userData.recordsets[0][0].Id,
          username: userData.recordsets[0][0].Username,
          email: userData.recordsets[0][0].Email,
        },
        process.env.VERIFY_EMAIL_TOKEN_EXPIRATION_TIME
      );

      sendEmailFromCustomAccount({
        to: Email,
        subject: "Reset Password",
        html: `<h2>Verify Your Email</h2><p>Click the link below to reset your password:</p><a href='${process.env.FRONTEND_URL}/forgot-password?token=${token}' target='_blank'>${process.env.FRONTEND_URL}/forgot-password?token=${token}</a>`,
      });

      handleResponse(response, 200, "success", "Verification email sent");
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
   * Reset Password
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async userForgotChangePassword(request, response, next) {
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
      const { Email, Password, Token } = request.body;

      let decodedToken = jwt.verify(Token, process.env.JWT_SECRET);
      if (Email !== decodedToken.email) {
        throw Error("Unauthorized");
      }

      let userPasswordResetResult;

      try {
        let params = [StringValue({ fieldName: "Email", value: Email })];

        let User = await executeSp({
          spName: `UserGetByEmail`,
          params: params,
          connection,
        });

        console.log(User.recordsets[0][0]);

        // Hash the password before saving
        // const hashedPassword = await bcrypt.hash(Password, 10);

        params = [
          StringValue({
            fieldName: "UserId",
            value: User.recordsets[0][0].Id.toString(),
          }),
          StringValue({ fieldName: "Password", value: Password }),
          // StringValue({ fieldName: "Password", value: hashedPassword }), // Use hashed password
        ];

        console.log(params);

        userPasswordResetResult = await executeSp({
          spName: `UserResetPassword`,
          params: params,
          connection,
        });
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

      userPasswordResetResult = userPasswordResetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Password changed successfully",
        null
        // adding null and set to not visible record data with the response
        // userPasswordResetResult
      );
    } catch (error) {
      handleError(
        response,
        401,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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

      const tokenResponse = await getToken(request);
      console.log(tokenResponse);
      const { token, refreshToken } = tokenResponse.data;

      handleResponse(
        response,
        200,
        "success",
        "User authenticated successfully",
        { ...authenticateResult, token, refreshToken }
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
   * Refersh Token User
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async refreshTokenAPI(request, response, next) {
    try {
      const { Token } = request.body;
      console.log(request.body);

      const tokenResponse = await refreshTokenGAS(Token);
      console.log("tokenResponse");
      console.log(tokenResponse);

      if (tokenResponse != null) {
        const { token, refreshToken } = tokenResponse.data;
        handleResponse(
          response,
          200,
          "success",
          "User authenticated successfully",
          { token, refreshToken }
        );
      } else {
        handleResponse(response, 401, "success", "invalid token", {});
      }
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
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
