import sql from "mssql";
import executeSp from "../db/exeSp.js";
import handleError from "../utils/handleError.js";
import handleResponse from "../utils/handleResponse.js";

export const saveUpdateOpdServiceCategory = async (req, res, next) => {
  try {
    const { Id, UserSaved, CategoryName, InstituteBranchId } = req.body;
    let connection = req.app.locals.db;
    let opdServiceCategorySaveResult = await executeSp({
      spName: "OpdServiceCategorySaveUpdate",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "CategoryName",
          type: sql.TYPES.NVarChar(255),
          value: CategoryName,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
      ],
      connection,
    });
    opdServiceCategorySaveResult = opdServiceCategorySaveResult.recordsets[0];
    console.log(opdServiceCategorySaveResult);

    handleResponse(
      res,
      200,
      "success",
      "Successfully saved opd service category details",
      opdServiceCategorySaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "Could not save opd service category details",
      error
    );
    next(error);
  }
};

export const saveUpdateOpdServiceSubCategory = async (req, res, next) => {
  try {
    const { Id, UserSaved, CategoryId, SubCategoryName } = req.body;
    let connection = req.app.locals.db;
    let opdServiceSubcategorySaveResult = await executeSp({
      spName: "OpdServiceSubcategorySave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "CategoryId",
          type: sql.TYPES.Int,
          value: CategoryId,
        },
        {
          name: "SubCategoryName",
          type: sql.TYPES.NVarChar(255),
          value: SubCategoryName,
        },
      ],
      connection,
    });
    opdServiceSubcategorySaveResult =
      opdServiceSubcategorySaveResult.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Successfully saved opd service subcategory details",
      opdServiceSubcategorySaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "Could not save opd service subcategory details",
      error
    );
    next(error);
  }
};

export const saveUpdateOpdService = async (req, res, next) => {
  try {
    const { Id, CategoryId, SubCategoryId, ServiceName, Price, UserSaved } =
      req.body;
    let connection = req.app.locals.db;
    let opdServiceCategorySaveResult = await executeSp({
      spName: "OpdServiceSaveUpdate",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "CategoryId",
          type: sql.TYPES.Int,
          value: CategoryId,
        },
        {
          name: "SubCategoryId",
          type: sql.TYPES.Int,
          value: SubCategoryId,
        },
        {
          name: "ServiceName",
          type: sql.TYPES.NVarChar(255),
          value: ServiceName,
        },
        {
          name: "Price",
          type: sql.TYPES.Float,
          value: Price,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    opdServiceCategorySaveResult = opdServiceCategorySaveResult.recordsets[0];
    console.log(opdServiceCategorySaveResult);

    handleResponse(
      res,
      200,
      "success",
      "Successfully saved opd service details",
      opdServiceCategorySaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save opd service details", error);
    next(error);
  }
};

export const getOpdServiceCategories = async (req, res, next) => {
  try {
    const { Id, InstituteBranchId } = req.body;
    let connection = req.app.locals.db;
    let opdServiceCategoryGetResult = await executeSp({
      spName: "OpdServiceCategoryGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
      ],
      connection,
    });
    opdServiceCategoryGetResult = opdServiceCategoryGetResult.recordsets[0];
    console.log(opdServiceCategoryGetResult);

    handleResponse(
      res,
      200,
      "success",
      "Successfully retrieved opd service details",
      opdServiceCategoryGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "Could not retrieve opd service details",
      error
    );
    next(error);
  }
};

export const getOpdServiceSubCategories = async (req, res, next) => {
  try {
    const { Id, CategoryId } = req.body;
    let connection = req.app.locals.db;
    let opdServiceSubCategoryGetResult = await executeSp({
      spName: "OpdServiceSubCategoryGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "CategoryId",
          type: sql.TYPES.Int,
          value: CategoryId,
        },
      ],
      connection,
    });
    opdServiceSubCategoryGetResult =
      opdServiceSubCategoryGetResult.recordsets[0];
    console.log(opdServiceSubCategoryGetResult);

    handleResponse(
      res,
      200,
      "success",
      "Successfully retrieved opd service sub category details",
      opdServiceSubCategoryGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "Could not retrieve opd service sub category  details",
      error
    );
    next(error);
  }
};

export const getOpdServicesAndSubCategories = async (req, res, next) => {
  try {
    const { SubCategoryId, CategoryId } = req.body;
    let connection = req.app.locals.db;
    let opdServiceAndSubCategoryGetResult = await executeSp({
      spName: "OpdServicesAndSubCategoriesGet",
      params: [
        {
          name: "SubCategoryId",
          type: sql.TYPES.Int,
          value: SubCategoryId,
        },
        {
          name: "CategoryId",
          type: sql.TYPES.Int,
          value: CategoryId,
        },
      ],
      connection,
    });
    opdServiceAndSubCategoryGetResult =
      opdServiceAndSubCategoryGetResult.recordsets[0];
    console.log(opdServiceAndSubCategoryGetResult);

    handleResponse(
      res,
      200,
      "success",
      "Successfully retrieved opd service and sub category details",
      opdServiceAndSubCategoryGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "Could not retrieve opd service and sub category  details",
      error
    );
    next(error);
  }
};
