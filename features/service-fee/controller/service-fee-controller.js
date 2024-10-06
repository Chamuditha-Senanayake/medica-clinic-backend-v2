import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const serviceFeeSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { serviceFeeId, serviceName, userId, instituteId } = req.body;

    if (
      serviceName === null ||
      serviceName === undefined ||
      serviceName === ""
    ) {
      throw new Error("Service fee name is required");
    }
    if (userId === null || userId === undefined || userId === "") {
      throw new Error("User id is required");
    }
    if (
      instituteId === null ||
      instituteId === undefined ||
      instituteId === ""
    ) {
      throw new Error("Institute id is required");
    }

    const serviceFeeSaveResult = await executeSp({
      spName: "ServiceFeeSave",
      params: [
        {
          name: "ServiceName",
          type: sql.TYPES.NVarChar,
          value: serviceName,
        },
        {
          name: "UserCreated",
          type: sql.TYPES.Int,
          value: userId,
        },
        {
          name: "ServiceFeeId",
          type: sql.TYPES.Int,
          value: serviceFeeId,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: instituteId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Service fee added successfully",
      serviceFeeSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const getServicesByInstitute = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { ServiceFeeId, InstituteId } = req.body;

    const serivceFeeGetResult = await executeSp({
      spName: "ServiceFeeGetV2",
      params: [
        {
          name: "ServiceFeeId",
          type: sql.TYPES.Int,
          value: ServiceFeeId,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: InstituteId,
        },
      ],
      connection,
    });

    serivceFeeGetResult = serivceFeeGetResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      serivceFeeGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
