import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString,
  FloatValue,
} from "../../../utils/type-def.js";

const DrugController = {
  /**
   *
   * get drug allergy by [Id, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDrugAllergy(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
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

      let drugAllergyGetResult = await executeSp({
        spName: `DrugAllergyGet`,
        params: params,
        connection,
      });

      drugAllergyGetResult = drugAllergyGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Drug allergy list retrived successfully",
        drugAllergyGetResult
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
   * save a drug allergy
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveDrugAllergy(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
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

      let drugAllergySaveResult = await executeSp({
        spName: `DrugAllergySave`,
        params: params,
        connection,
      });

      console.log(drugAllergySaveResult.recordsets);
      drugAllergySaveResult = drugAllergySaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Drug allergy retrieved successfully",
        drugAllergySaveResult
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
   * get drug count
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDrugCount(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {UserId,DoctorId, DateFrom, DateTo} = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        DateString({ fieldName: 'DateFrom', value: DateFrom }),
        DateString({ fieldName: 'DateTo', value: DateTo }),
      ];

      let drugCountGetResult = await executeSp({
        spName: `DrugCountGet`,
        params: params,
        connection,
      });

      drugCountGetResult = drugCountGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Drug count retrived successfully",
        drugCountGetResult
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
   * get drug
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDrug(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, Source, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "Source", value: Source }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let drugGetResult = await executeSp({
        spName: `DrugGet`,
        params: params,
        connection,
      });

      drugGetResult = drugGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Drug list retrived successfully",
        drugGetResult
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
   * save a drug
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveDrug(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        RawName,
        GenericName,
        TradeName,
        DrugTypeId,
        Weight,
        WeightType,
        Status ,
        UserSaved,
        Source,
        Description
      } = request.body;

    var params = [
       EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "RawName", value: RawName }),
        StringValue({ fieldName: "GenericName", value: GenericName }),
        StringValue({ fieldName: "TradeName", value: TradeName }),
        EntityId({ fieldName: "DrugTypeId", value: DrugTypeId }),
        FloatValue({ fieldName: "Weight", value: Weight }),
        StringValue({ fieldName: "WeightType", value: WeightType }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        StringValue({ fieldName: "Source", value: Source }),
        StringValue({ fieldName: "Description", value: Description }),

    ];

      let drugSaveResult = await executeSp({
        spName: `DrugSave`,
        params: params,
        connection,
      });

      console.log(drugSaveResult.recordsets);
      drugSaveResult = drugSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Drug retrieved successfully",
        drugSaveResult
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
   * switch drug status
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async switchDrugStatus(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, Active, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        SignedInteger({
        fieldName: "Active",
        value: Active,
      }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let drugStatusSwitchResult = await executeSp({
        spName: `DrugStatusSwitch`,
        params: params,
        connection,
      });

      drugStatusSwitchResult = drugStatusSwitchResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Drug status switched successfully",
        drugStatusSwitchResult
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
   * get drug template
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */

  async getDrugTemplate(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
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

      let drugTemplateGetResult = await executeSp({
        spName: `DrugTemplateGet`,
        params: params,
        connection,
      });

      drugTemplateGetResult = drugTemplateGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Drug template retrived successfully",
        drugTemplateGetResult
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
   * save drug template
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */

  async saveDrugTemplate(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Drug.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { 
        Name,
        DoctorId,
        Status,
        UserSaved,
        Id, 
      } = request.body;

      var params = [
        StringValue({ fieldName: "Name", value: Name }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let drugTemplateSaveResult = await executeSp({
        spName: `DrugTemplateSave`,
        params: params,
        connection,
      });

      drugTemplateSaveResult = drugTemplateSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Drug template retrived successfully",
        drugTemplateSaveResult
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

export default DrugController;
