import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
} from "../../../utils/type-def.js";

const InstituteController = {
  /**
   *
   * get Institute Branch Doctor
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getInstituteBranchDoctor(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, InstituteBranchId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "InstituteBranchId", value: InstituteBranchId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let instituteBranchDoctorGetResult = await executeSp({
        spName: `InstituteBranchDoctorGet`,
        params: params,
        connection,
      });

      instituteBranchDoctorGetResult = instituteBranchDoctorGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        instituteBranchDoctorGetResult
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
   * save a Institute Branch Doctor
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveInstituteBranchDoctor(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        InstituteBranchId,
        DoctorId,
        Status,
        UserSaved
      } = request.body;

    var params = [
      EntityId({ fieldName: "Id", value: Id }),
      EntityId({ fieldName: "InstituteBranchId", value: InstituteBranchId }),
      EntityId({ fieldName: "DoctorId", value: DoctorId }),
      EntityId({ fieldName: "Status", value: Status }),
      EntityId({ fieldName: "UserSaved", value: UserSaved }),

    ];

      let instituteBranchDoctorSaveResult = await executeSp({
        spName: `InstituteBranchDoctorSave`,
        params: params,
        connection,
      });

      console.log(instituteBranchDoctorSaveResult.recordsets);
      instituteBranchDoctorSaveResult = instituteBranchDoctorSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        instituteBranchDoctorSaveResult
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

  
  // save a Institute Branch

  async getInstituteBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, DoctorId, InstituteId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "InstituteId", value: InstituteId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let instituteBranchGetResult = await executeSp({
        spName: `InstituteBranchGet`,
        params: params,
        connection,
      });

      instituteBranchGetResult = instituteBranchGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        instituteBranchGetResult
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
   * save a Institute Branch
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveInstituteBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        InstituteId,
        Name,
        AddressId,
        Email,
        Website,
        Status,
        UserSaved,
        ContactNumbers,
      } = request.body;

    var params = [
      EntityId({ fieldName: "Id", value: Id }),
      EntityId({ fieldName: "InstituteId", value: InstituteId }),
      StringValue({ fieldName: "Name", value: Name }),
      EntityId({ fieldName: "AddressId", value: AddressId }),

      StringValue({ fieldName: "Email", value: Email }),
      StringValue({ fieldName: "Website", value: Website }),
      SignedInteger({
        fieldName: "Status",
        value: Status,
      }),
      EntityId({ fieldName: "UserSaved", value: UserSaved }),
      StringValue({ fieldName: "ContactNumbers", value: ContactNumbers }),

    ];

      let instituteBranchSaveResult = await executeSp({
        spName: `InstituteBranchSave`,
        params: params,
        connection,
      });

      console.log(instituteBranchSaveResult.recordsets);
      instituteBranchSaveResult = instituteBranchSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        instituteBranchSaveResult
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

// get a Institute Doctor

  async getInstituteDoctor(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { InstituteId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "InstituteId", value: InstituteId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let instituteDoctorGetResult = await executeSp({
        spName: `InstituteDoctorGet`,
        params: params,
        connection,
      });

      instituteDoctorGetResult = instituteDoctorGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        instituteDoctorGetResult
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


  // get a Institute

  async getInstitute(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let instituteGetResult = await executeSp({
        spName: `InstituteGet`,
        params: params,
        connection,
      });

      instituteGetResult = instituteGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Institutes retrived successfully",
        instituteGetResult
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
   * save a Institute
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveInstitute(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Institute.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        Name,
        Email,
        Website,
        Status,
        UserSaved
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),

        StringValue({ fieldName: "Name", value: Name }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "Website", value: Website }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let instituteSaveResult = await executeSp({
        spName: `InstituteSave`,
        params: params,
        connection,
      });

      console.log(instituteSaveResult.recordsets);
      instituteSaveResult = instituteSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Institue retrieved successfully",
        instituteSaveResult
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

export default InstituteController;