import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  TableValueParameters,
  DateString,
} from "../../../utils/type-def.js";
import sql from "mssql";
import { getToken, refreshTokenGAS } from "../../../utils/gas.js";

const UserController = {
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
  /**
   *
   * Rest Password
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */ async getPresentation(request, response, next) {
    try {
      let connection = request.app.locals.db;
      const { UserId } = request.body;

      var params = [EntityId({ fieldName: "UserId", value: UserId })];

      let userGroupDetailsGetResult = await executeSp({
        spName: "UserPresentationNameByUserIdGet",
        params: params,
        connection,
      });
      userGroupDetailsGetResult = userGroupDetailsGetResult?.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        userGroupDetailsGetResult
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

  async getUserGroupDetails(request, response, next) {
    try {
      const { UserId, Id } = request.body;

      let connection = request.app.locals.db;

      let userGroupDetailsGetResult = await executeSp({
        spName: "UserGroupDetailsGetV2",
        params: [
          {
            name: "UserId",
            type: sql.TYPES.Int,
            value: UserId,
          },
          {
            name: "Id",
            type: sql.TYPES.Int,
            value: Id,
          },
        ],
        connection,
      });
      userGroupDetailsGetResult = userGroupDetailsGetResult?.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        userGroupDetailsGetResult
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

  async getUserGroups(request, response, next) {
    try {
      const { UserId, Id } = request.body;

      let connection = request.app.locals.db;

      let userGroupGetResult = await executeSp({
        spName: "UserGroupsGetV2",
        params: [
          {
            name: "UserId",
            type: sql.TYPES.Int,
            value: UserId,
          },
          {
            name: "Id",
            type: sql.TYPES.Int,
            value: Id,
          },
        ],
        connection,
      });
      userGroupGetResult = userGroupGetResult?.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        userGroupGetResult
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

  async checkUsernameAvailability(request, response, next) {
    try {
      const { username } = request.body;
      let connection = request.app.locals.db;

      if (username === null || username === undefined || username === "") {
        throw new Error("Username is required");
      }

      const usernameAvaialability = await executeSp({
        spName: "UserNameAvailabilityGet",
        params: [
          {
            name: "UserName",
            type: sql.TYPES.NVarChar,
            value: username,
          },
        ],
        connection,
      });

      handleResponse(
        response,
        200,
        "success",
        "Username avaialbility retrived",
        usernameAvaialability?.recordsets[0][0]
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

  async temporaryRegistration(request, response, next) {
    try {
      const {
        Id,
        FirstName,
        LastName,
        PhoneNumber,
        NIC,
        EmailAddress,
        Type,
        DateOfBirth,
        Gender,
        Language,
        UserCreated,
        UserModified,
      } = request.body;

      let connection = request.app.locals.db;

      let temporaryRegistrationResult = await executeSp({
        spName: "TemporaryRegistrationSave",
        params: [
          {
            name: "Id",
            type: sql.TYPES.Int,
            value: Id,
          },
          {
            name: "FirstName",
            type: sql.TYPES.NVarChar(100),
            value: FirstName,
          },
          {
            name: "LastName",
            type: sql.TYPES.NVarChar(100),
            value: LastName,
          },
          {
            name: "PhoneNumber",
            type: sql.TYPES.NVarChar(50),
            value: PhoneNumber,
          },
          {
            name: "NIC",
            type: sql.TYPES.NVarChar(15),
            value: NIC,
          },
          {
            name: "EmailAddress",
            type: sql.TYPES.NVarChar(100),
            value: EmailAddress,
          },
          {
            name: "Type",
            type: sql.TYPES.NVarChar(50),
            value: Type,
          },
          {
            name: "DateOfBirth",
            type: sql.TYPES.Date,
            value: DateOfBirth,
          },
          {
            name: "Gender",
            type: sql.TYPES.NVarChar(50),
            value: Gender,
          },
          {
            name: "Language",
            type: sql.TYPES.NVarChar(50),
            value: Language,
          },
          {
            name: "UserCreated",
            type: sql.TYPES.Int,
            value: UserCreated,
          },
          {
            name: "UserModified",
            type: sql.TYPES.Int,
            value: UserModified,
          },
        ],
        connection,
      });
      temporaryRegistrationResult =
        temporaryRegistrationResult?.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        temporaryRegistrationResult
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

  async getUsernameAndPassword(request, response, next) {
    try {
      let connection = request.app.locals.db;
      const { userId, userTypeId } = request.body;
      // console.log('request.body:', userId, userTypeId);
      const usernameAndPasswordGetResult = await executeSp({
        spName: "UserUsernameAndPasswordGet",
        params: [
          {
            name: "UserId",
            type: sql.TYPES.Int,
            value: userId ? userId : null,
          },
          {
            name: "UserTypeId",
            type: sql.TYPES.Int,
            value: userTypeId ? userTypeId : null,
          },
        ],
        connection,
      });

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        usernameAndPasswordGetResult.recordset
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

  async saveUpdateUser(request, response, next) {
    try {
      let connection = request.app.locals.db;
      const {
        Id,
        Username,
        Password,
        UserGroupId,
        Status,
        UserCreated,
        UserModified,
      } = request.body;
      // console.log('request.body:', userId, userTypeId);
      const usernameAndPasswordGetResult = await executeSp({
        spName: "UserSave",
        params: [
          EntityId({ fieldName: "Id", value: Id }),
          StringValue({ fieldName: "Username", value: Username }),
          StringValue({ fieldName: "Password", value: Password }),
          EntityId({ fieldName: "UserGroupId", value: UserGroupId }),
          SignedInteger({ fieldName: "Status", value: Status }),
          EntityId({ fieldName: "UserCreated", value: UserCreated }),
          EntityId({ fieldName: "UserModified", value: UserModified }),
        ],
        connection,
      });

      handleResponse(
        response,
        200,
        "success",
        "User saved successfully",
        usernameAndPasswordGetResult.recordset[0][0]
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
