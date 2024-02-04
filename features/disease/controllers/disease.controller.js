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

const DiseaseController = {
  /**
   *
   * get disease by [Id, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDisease(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Disease.VALIDATION_ERROR,
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

      let diseaseGetResult = await executeSp({
        spName: `DiseaseGet`,
        params: params,
        connection,
      });

      diseaseGetResult = diseaseGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Disease data retrived successfully",
        diseaseGetResult
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
   * save a disease
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveDisease(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Disease.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        Name,
        Status,
        UserSaved,
      } = request.body;

    var params = [
      EntityId({ fieldName: "Id", value: Id }),
      StringValue({ fieldName: "Name", value: Name }),
      SignedInteger({
        fieldName: "Status",
        value: Status,
      }),
      EntityId({ fieldName: "UserSaved", value: UserSaved }),
    ];

      let diseaseSavetResult = await executeSp({
        spName: `DiseaseSave`,
        params: params,
        connection,
      });

      console.log(diseaseSavetResult.recordsets);
      diseaseSavetResult = diseaseSavetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Disease data retrieved successfully",
        diseaseSavetResult
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
   * get allergy by [Id, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getFoodAllergy(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Disease.VALIDATION_ERROR,
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

      let foodAllergyGet = await executeSp({
        spName: `FoodAllergyGet`,
        params: params,
        connection,
      });

      foodAllergyGet = foodAllergyGet.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Allergy data retrived successfully",
        foodAllergyGet
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
   * save a allergy
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveFoodAllergy(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Disease.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        Name,
        Status,
        UserSaved,
      } = request.body;

    var params = [
      EntityId({ fieldName: "Id", value: Id }),
      StringValue({ fieldName: "Name", value: Name }),
      SignedInteger({
        fieldName: "Status",
        value: Status,
      }),
      EntityId({ fieldName: "UserSaved", value: UserSaved }),
    ];

      let foodAllergySaveResult = await executeSp({
        spName: `FoodAllergySave`,
        params: params,
        connection,
      });

      console.log(foodAllergySaveResult.recordsets);
      foodAllergySaveResult = foodAllergySaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Allergy data retrieved successfully",
        foodAllergySaveResult
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

export default DiseaseController;
