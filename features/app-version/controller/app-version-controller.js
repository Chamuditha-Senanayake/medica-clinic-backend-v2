import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const saveAppVersion = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, AppName, Platform, CurrentVersion, VersionCode } = req.body;

    let appVersionSaveResult = await executeSp({
      spName: "AppVersionSave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "AppName",
          type: sql.TYPES.NVarChar(100),
          value: AppName,
        },
        {
          name: "Platform",
          type: sql.TYPES.NVarChar(100),
          value: Platform,
        },
        {
          name: "CurrentVersion",
          type: sql.TYPES.NVarChar(100),
          value: CurrentVersion,
        },
        {
          name: "VersionCode",
          type: sql.TYPES.Int,
          value: VersionCode,
        },
      ],
      connection,
    });

    appVersionSaveResult = appVersionSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      appVersionSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getAppVersion = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, AppName, Platform } = req.body;

    let appVersionGetResult = await executeSp({
      spName: "AppVersionGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "AppName",
          type: sql.TYPES.NVarChar(100),
          value: AppName,
        },
        {
          name: "Platform",
          type: sql.TYPES.NVarChar(100),
          value: Platform,
        },
      ],
      connection,
    });

    appVersionGetResult = appVersionGetResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      appVersionGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const inwardBedSave = async (req, res, next) => {
  try {
    const { Id, WardId, Number, BedNumbers, Status, UserSaved } = req.body;

    let wardBedSaveResponse = await executeSp({
      spName: "Inward.WardBedSaveV2",
      params: [
        {
          name: "WardId",
          type: sql.TYPES.Int,
          value: WardId,
        },
        {
          name: "Number",
          type: sql.TYPES.Int,
          value: Number,
        },
        {
          name: "BedNumbers",
          type: sql.TYPES.NVarChar(100),
          value: BedNumbers,
        },
        {
          name: "Status",
          type: sql.TYPES.Int,
          value: Status,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
      ],
      connection,
    });

    wardBedSaveResponse = wardBedSaveResponse.recordsets[0];

    handleResponse(
      response,
      200,
      "success",
      "Successfully saved beds",
      wardBedSaveResponse
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const nurseInstituteBranchWardSave = async (req, res, next) => {
  try {
    const {
      Id,
      WardId,
      NurseId,
      AssignmentStartDate,
      AssignmentEndDate,
      UserSaved,
    } = req.body;

    let connection = req.app.locals.db;

    let assignNurseToWardResult = await executeSp({
      spName: "Inward.NurseInstituteBranchWardSave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "WardId",
          type: sql.TYPES.Int,
          value: WardId,
        },
        {
          name: "NurseId",
          type: sql.TYPES.Int,
          value: NurseId,
        },
        {
          name: "AssignmentStartDate",
          type: sql.TYPES.Date,
          value: AssignmentStartDate,
        },
        {
          name: "AssignmentEndDate",
          type: sql.TYPES.Date,
          value: AssignmentEndDate,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    assignNurseToWardResult = assignNurseToWardResult?.recordsets[0][0];

    handleResponse(
      response,
      200,
      "success",
      "Operation Success",
      assignNurseToWardResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const appVersion = async (req, res, next) => {
  try {
    handleResponse(res, 200, "success", "App version notifier", {
      currentVersion: "1.0.1",
    });
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
