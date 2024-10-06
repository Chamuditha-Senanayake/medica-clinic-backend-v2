import dotenv from "dotenv";
import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { deHashId, deHashPatientId } from "../../../utils/id-hashing.js";

dotenv.config();

export const getNearestPharmacies = async (req, res, next) => {
  try {
    const { Latitude, Longitude, PerimeterRadius } = req.body;

    let connection = req.app.locals.db;

    let nearestPharmaciesResult = await executeSp({
      spName: "NearestPharmaciesGet",
      params: [
        {
          name: "Latitude",
          type: sql.TYPES.NVarChar(20),
          value: Latitude,
        },
        {
          name: "Longitude",
          type: sql.TYPES.NVarChar(20),
          value: Longitude,
        },
        {
          name: "PerimeterRadius",
          type: sql.TYPES.Float,
          value: PerimeterRadius,
        },
      ],
      connection,
    });
    nearestPharmaciesResult = nearestPharmaciesResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Nearest Pharmacies found successfully",
      nearestPharmaciesResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const savePharmacyPurchase = async (req, res, next) => {
  try {
    const {
      Id,
      PatientId,
      Status,
      PrescriptionId,
      PharmacyId,
      PharmacyUrl,
      UserSaved,
    } = req.body;

    let connection = req.app.locals.db;

    let savePharmacyPurchaseResult = await executeSp({
      spName: "PharmacyPurchaseSave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "Status",
          type: sql.TYPES.NVarChar(100),
          value: Status,
        },

        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: deHashId({ Id: PrescriptionId }),
        },
        {
          name: "PharmacyId",
          type: sql.TYPES.Int,
          value: PharmacyId,
        },
        {
          name: "PharmacyUrl",
          type: sql.TYPES.NVarChar(500),
          value: PharmacyUrl,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    savePharmacyPurchaseResult = savePharmacyPurchaseResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Pharmacy purchase saved successfully",
      savePharmacyPurchaseResult
    );
  } catch (error) {
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const updatePharmacyPurchaseStatus = async (req, res, next) => {
  try {
    const { Id, PrescriptionId, Status, UserSaved } = req.body;

    let connection = req.app.locals.db;

    let updatePharmacyPurchaseResult = await executeSp({
      spName: "UpdatePharmacyPurchaseStatus",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: deHashId({ Id: PrescriptionId }),
        },
        {
          name: "Status",
          type: sql.TYPES.NVarChar(100),
          value: Status,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });

    updatePharmacyPurchaseResult =
      updatePharmacyPurchaseResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Pharmacy purchase status updated successfully",
      updatePharmacyPurchaseResult
    );
  } catch (error) {
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getPharmacyPurchaseByStatus = async (req, res, next) => {
  try {
    const { PatientId, Status } = req.body;

    let connection = req.app.locals.db;

    let getPharmacyPurchaseResult = await executeSp({
      spName: "PharmacyPurchaseByStatusGet",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "Status",
          type: sql.TYPES.NVarChar(100),
          value: Status,
        },
      ],
      connection,
    });

    getPharmacyPurchaseResult = getPharmacyPurchaseResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Pharmacy purchase retrieved successfully",
      getPharmacyPurchaseResult
    );
  } catch (error) {
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
