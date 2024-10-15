import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const paymentOptionSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { PaymentOptionName, InstituteBranchId, IsEnable, Id, UserId } =
      req.body;

    let paymentOptionSaveResult = await executeSp({
      spName: "InstituteBranchPaymentOptionsSave",
      params: [
        {
          name: "PaymentOptionName",
          type: sql.TYPES.NVarChar(50),
          value: PaymentOptionName,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
        {
          name: "IsEnable",
          type: sql.TYPES.Bit,
          value: IsEnable,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "UserId",
          type: sql.TYPES.Bit,
          value: UserId,
        },
      ],
      connection,
    });

    paymentOptionSaveResult = paymentOptionSaveResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      paymentOptionSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const paymentOptionGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { InstituteBranchId } = req.body;

    let paymentOptionGetResult = await executeSp({
      spName: "InstituteBranchPaymentOptionsGet",
      params: [
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
      ],
      connection,
    });

    paymentOptionGetResult = paymentOptionGetResult?.recordsets[0];
    console.log(paymentOptionGetResult);
    const paymentOptions = {
      WALLET: true,
      PAY_AT_HOSPITAL: true,
      ONLINE_PAYMENT: false,
      COUPON: true,
      CARE: false,
    };
    if (
      Array.isArray(paymentOptionGetResult) &&
      paymentOptionGetResult.length > 0
    ) {
      paymentOptionGetResult.forEach((item) => {
        paymentOptions[item.PaymentOptionName] = item.IsEnable;
      });
    }

    handleResponse(res, 200, "success", "Operation Success", paymentOptions);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const instituteBranchGet = async (req, res, next) => {
  try {
    const { branchId, doctorId, instituteId, userId } = req.body;
    let connection = req.app.locals.db;
    let instituteBranchGetResult = await executeSp({
      spName: "InstituteBranchGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: branchId ? branchId : null,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId ? doctorId : null,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: instituteId ? instituteId : null,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId ? userId : null,
        },
      ],
      connection,
    });
    instituteBranchGetResult = instituteBranchGetResult?.recordset;
    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      instituteBranchGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const institutAndBranchesGet = async (req, res, next) => {
  try {
    const { branchId, doctorId, instituteId, userId } = req.body;
    let connection = req.app.locals.db;
    let instituteAndBranchesGetResult = await executeSp({
      spName: "InstitutesAndBranchGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: branchId ? branchId : null,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId ? userId : null,
        },
      ],
      connection,
    });

    instituteAndBranchesGetResult =
      instituteAndBranchesGetResult?.recordsets[0];

    instituteAndBranchesGetResult.forEach((element) => {
      if (element?.Branches) {
        element.Branches = JSON.parse(element.Branches);
      } else {
        element.Branches = [];
      }
    });

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      instituteAndBranchesGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
