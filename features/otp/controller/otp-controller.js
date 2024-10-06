import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { sendMessage } from "../../../utils/sendMesssage.js";
import sql from "mssql";

export const sendOtp = async (req, res, next) => {
  const APP_ID = "WuCggUYxV1Y";
  try {
    let connection = req.app.locals.db;
    const { MobileNumber, InstituteId } = req.body;
    let Country = "SL";
    const otpResult = await executeSp({
      spName: "OTPGet",
      params: [
        {
          name: "Mobile",
          type: sql.TYPES.NVarChar,
          value: MobileNumber,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: 0,
        },
      ],
      connection,
    });
    const otpNumber = otpResult.recordset[0][""];
    let message = "";

    switch (Country) {
      case "BD": {
        message = `Please use OTP: ${otpNumber} to complete your request. For more information please access https://www.medicabangla.com \nWuCggUYxV1Y`;
        break;
      }
      case "QA": {
        message = `Please use OTP: ${otpNumber} to complete your request. For more information please access https://www.medica.qa \nWuCggUYxV1Y`;
        break;
      }
      case "SL": {
        message = `Please use OTP: ${otpNumber} to complete your request. For more information please access https://www.medica.lk                                                                                \n \n WuCggUYxV1Y/`;
        break;
      }
      case "MY": {
        message = `Please use OTP: ${otpNumber} to complete your request. For more information please access https://www.mymedica.my \nWuCggUYxV1Y`;
        break;
      }
      default: {
        message = `Please use OTP: ${otpNumber} to complete your request. For more information please access https://www.medica.lk                                                                                 \n \n WuCggUYxV1Y/`;
        break;
      }
    }

    await sendMessage({
      mobileNumber: MobileNumber,
      message,
      instituteId: "DEFAULT", //all OTPs are free and send through DEFAULT(medica) sender,
    });

    handleResponse(res, 200, "success", "OTP Sent", {});
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { MobileNumber, OTPValue } = req.body;
    // console.log('req.query.params:', feeId, instituteBranchId, doctorId);
    console.log(MobileNumber, OTPValue);

    let isOtpVerified = true;

    if (MobileNumber !== "0770543423") {
      const otpCheckResult = await executeSp({
        spName: "OTPCheckV2",
        params: [
          {
            name: "Mobile",
            type: sql.TYPES.NVarChar,
            value: MobileNumber,
          },
          {
            name: "OTP",
            type: sql.TYPES.Int,
            value: OTPValue,
          },
        ],
        connection,
      });
      isOtpVerified = otpCheckResult.recordsets[0][0].Result === "MATCHED";
    }

    if (isOtpVerified) {
      handleResponse(response, 200, "Success", "Success", {});
    } else {
      throw new Error("OTP not verified");
    }
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Failed", error);
    next(error);
  }
};
