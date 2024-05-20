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
  DateString,
} from "../../../utils/type-def.js";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import sql from "mssql";


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

      let token = jwtSign(
        {
          userId: userLoginResult.Id,
          username: userLoginResult.Username,
          email: userLoginResult.Email,
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
      let ProfileImage;
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
                console.log("response.data", response.data)
                Email = response.data.email;
                ProfileImage = response.data.picture;
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
        StringValue({ fieldName: "ProfileImage", value: ProfileImage }),
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
        throw Error("User not found");
      }

      let token = jwtSign(
        {
          userId: userData.recordsets[0][0].Id,
          username: userData.recordsets[0][0].Username,
          email: userData.recordsets[0][0].Email,
        },
        "1h"
      );

      sendEmailFromCustomAccount({
        to: Email,  
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

      let OCRSavesResult = await executeSp({
        spName: `OCRSaves`,
        params: params,
        connection,
      });

      OCRSavesResult = OCRSavesResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "OCR saved successfully",
        OCRSavesResult
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
  async userResetPassword(request, response, next) {
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
      if (Email !== decodedToken.email ){
        throw Error("Unauthorized");
      }

      let userPasswordResetResult;

      try{

        let params = [
          StringValue({ fieldName: "Email", value: Email }),
        ];

        let User = await executeSp({
          spName: `UserGetByEmail`,
          params: params,
          connection,
        }); 
      
        params = [
          StringValue({ fieldName: "Username", value: User.recordsets[0][0].Username }),
          StringValue({ fieldName: "Password", value: Password }),       
        ];

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
        userPasswordResetResult
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
   * Get profile
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getProfile(request, response, next) {
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
      
      var params = [StringValue({ fieldName: "Email", value: request.user.email })];

      let getProfileResult = await executeSp({
        spName: `UserGetByEmail`,
        params: params,
        connection,
      });

      getProfileResult = getProfileResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "User data retrived successfully",
        getProfileResult
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
   * Basic profile info update
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async updateBasicProfileInfo(request, response, next) {
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
      let userContactInfoResult;
      const {
        Id,
        FName,
        MName,
        LName,
        Email,
        Occupation,
        SSN ,
        NIC,
        Passport,
        ProfileImage,
        Status = 1,
        IsBasicProfileInfo=1,

        PrimaryContact,
        SecondaryContact,

        Country,
        AddressLine1,
        City,
        Postcode
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),  
        { name: 'FName', type: sql.NVarChar, value:FName } ,           
        { name: 'MName', type: sql.NVarChar, value:MName } ,
        { name: 'LName', type: sql.NVarChar, value:LName } ,
        { name: 'Email', type: sql.NVarChar, value:Email } ,
        { name: 'Occupation', type: sql.NVarChar,  value:Occupation } ,
        { name: 'SSN', type: sql.NVarChar, value:SSN } ,
        { name: 'NIC', type: sql.NVarChar, value:NIC } ,
        { name: 'Passport', type: sql.NVarChar, value:Passport } ,
        { name: 'ProfileImage', type: sql.NVarChar, value:ProfileImage } , 
        { name: 'IsBasicProfileInfo', type: sql.Bit, value:IsBasicProfileInfo } , 
        SignedInteger({fieldName: "Status", value: Status}),
      ];

      let updateBasicProfileInfoResult = await executeSp({
        spName: `UserSave`,
        params: params,
        connection,
      });

      updateBasicProfileInfoResult = updateBasicProfileInfoResult.recordsets[0][0];

      var params = [
        EntityId({ fieldName: "UserId", value: Id }),          
        { name: 'Country', type: sql.NVarChar, value: Country } ,
        { name: 'AddressLine1', type: sql.NVarChar, value: AddressLine1 } ,
        { name: 'City', type: sql.NVarChar, value: City } , 
        { name: 'Postcode', type: sql.NVarChar, value: Postcode } ,
        SignedInteger({fieldName: "Status", value: Status}), 
      ];

      let userAddressInfoResult = await executeSp({
        spName: `AddressSave`,
        params: params,
        connection,
      });

      updateBasicProfileInfoResult.AddressInfo = userAddressInfoResult.recordsets[0][0];


      if(PrimaryContact){
        var params = [
          EntityId({ fieldName: "UserId", value: Id }),          
          { name: 'Profile', type: sql.NVarChar, value: PrimaryContact } ,
          { name: 'ProfileType', type: sql.NVarChar, value: 'primary-contact' } ,
          SignedInteger({fieldName: "Status", value: Status}), 
        ];

        userContactInfoResult = await executeSp({
        spName: `UserSocialProfileSave`,
        params: params,
        connection,
        });

        updateBasicProfileInfoResult.PrimaryContact = userContactInfoResult.recordsets[0][0];
      }

      if(SecondaryContact){
        var params = [
          EntityId({ fieldName: "UserId", value: Id }),          
          { name: 'Profile', type: sql.NVarChar, value: SecondaryContact } ,
          { name: 'ProfileType', type: sql.NVarChar, value: 'secondary-contact' } ,
          SignedInteger({fieldName: "Status", value: Status}), 
        ];
        userContactInfoResult = await executeSp({
        spName: `UserSocialProfileSave`,
        params: params,
        connection,
        });

        updateBasicProfileInfoResult.SecondaryContact = userContactInfoResult.recordsets[0][0];
      }

      handleResponse(
        response,
        200,
        "success",
        "Basic profile info updated successfully",
        updateBasicProfileInfoResult
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
   * Personal profile info update
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async updatePersonalProfileInfo(request, response, next) {
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
        Id,
        Gender,
        Dob,
        CivilStatus,
        Ethnicity,
        Weight,
        Height ,
        SocialProfile,
        Status = 1,
        IsBasicProfileInfo = 0
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),     
        { name: 'Gender', type: sql.NVarChar, value:Gender } ,
        { name: 'Dob', type: sql.NVarChar, value:Dob } ,
        { name: 'CivilStatus', type: sql.NVarChar, value:CivilStatus } ,
        { name: 'Ethnicity', type: sql.NVarChar, value:Ethnicity } ,  
        { name: 'IsBasicProfileInfo', type: sql.Bit, value:IsBasicProfileInfo } ,   
        SignedInteger({fieldName: "Status", value: Status}),
      ];

      let updatePersonalProfileInfoResult = await executeSp({
        spName: `UserSave`,
        params: params,
        connection,
      });

      updatePersonalProfileInfoResult = updatePersonalProfileInfoResult.recordsets[0][0];

      var params = [
        EntityId({ fieldName: "UserId", value: Id }),     
        { name: 'Weight', type: sql.Int, value:Weight } ,
        { name: 'Height', type: sql.Int, value:Height } , 
        { name: 'IsPersonalProfileInfo', type: sql.Bit, value:1 } ,   
        SignedInteger({fieldName: "Status", value: Status}),
      ];

      await executeSp({
        spName: `PatientSave`,
        params: params,
        connection,
      })

       if(SocialProfile){
        for (let profile of SocialProfile) {
            const params = [
                { name: 'UserId', type: sql.Int, value: Id },
                { name: 'Profile', type: sql.NVarChar, value: profile.Profile },
                { name: 'ProfileType', type: sql.NVarChar, value: profile.ProfileType },
                { name: 'Status', type: sql.Int, value: Status } 
            ];

            const result = await executeSp({
                spName: 'UserSocialProfileSave',
                params: params,
                connection: connection
            });
        }
      }

      handleResponse(
        response,
        200,
        "success",
        "Basic profile info updated successfully",
        updatePersonalProfileInfoResult
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
   * Basic profile info get
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getUserProfileInfo(request, response, next) {
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

      let params = [EntityId({ fieldName: "Id", value: request.user.userId })];

      let getUserProfileInfoResult = await executeSp({
        spName: `BasicProfileInfoGet`,
        params: params,
        connection,
      });

      getUserProfileInfoResult = getUserProfileInfoResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "User profile info retrieved successfully",
        getUserProfileInfoResult
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
