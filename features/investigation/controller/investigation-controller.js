import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";

export const saveInvestigationResults = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { InvestigationDetails, InvestigationData, InvestigationDocuments } =
      req.body;

    const investigationResultsTable = new sql.Table();
    investigationResultsTable.columns.add("Id", sql.Int);
    investigationResultsTable.columns.add("TestName", sql.NVarChar(200));
    investigationResultsTable.columns.add("TestValue", sql.NVarChar(100));
    investigationResultsTable.columns.add("Unit", sql.NVarChar(50));
    investigationResultsTable.columns.add("Range", sql.NVarChar(100));

    InvestigationData.forEach((result) => {
      investigationResultsTable.rows.add(
        result?.Id,
        result?.TestName,
        result?.TestValue,
        result?.Unit,
        result?.Range
      );
    });

    const investigationResultDocumentsTable = new sql.Table();
    investigationResultDocumentsTable.columns.add("Id", sql.Int);
    investigationResultDocumentsTable.columns.add(
      "FileName",
      sql.NVarChar(200)
    );

    if (Array.isArray(InvestigationDocuments)) {
      InvestigationDocuments.forEach((result) => {
        investigationResultDocumentsTable.rows.add(
          result?.Id,
          result?.FileName
        );
      });
    }

    console.log(investigationResultsTable);

    const investigationSaveResult = await executeSp({
      spName: "InvestigationSave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: InvestigationDetails?.Id,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: InvestigationDetails?.DoctorId,
        },
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: InvestigationDetails?.PrescriptionId,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: InvestigationDetails?.PatientId,
        },
        {
          name: "DateIssued",
          type: sql.TYPES.Date,
          value: InvestigationDetails?.DateIssued,
        },
        {
          name: "InvestigationsResults",
          type: sql.TVP("InvestigationResultItem"),
          value: investigationResultsTable,
        },
        {
          name: "InvestigationsResultDocuments",
          type: sql.TVP("InvestigationResultDocument"),
          value: investigationResultDocumentsTable,
        },
        {
          name: "InvestigationName",
          type: sql.TYPES.NVarChar(200),
          value: InvestigationDetails?.InvestigationName,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: InvestigationDetails?.UserSaved,
        },
      ],
      connection,
    });
    let investigationResults = investigationSaveResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Investigation saved",
      investigationResults
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getInvestigationsByPrescription = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { PrescriptionId } = req.body;

    const investigationGetResult = await executeSp({
      spName: "InvestigationGet",
      params: [
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: PrescriptionId,
        },
      ],
      connection,
    });

    let investigationResults = investigationGetResult?.recordsets[0];

    if (Array.isArray(investigationResults)) {
      for (let i = 0; i < investigationResults.length; i++) {
        if (investigationResults[i].InvestigationResults) {
          investigationResults[i].InvestigationResults = JSON.parse(
            investigationResults[i].InvestigationResults
          );
        }
      }
    }

    handleResponse(
      res,
      200,
      "success",
      "Investigations retrieved",
      investigationResults
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not load investigations", error);
  }
};

export const getInvestigationsByDoctorAndPatientId = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { DoctorId, PatientId } = req.body;

    const investigationGetResult = await executeSp({
      spName: "InvestigationByDoctorAndPatientGet",
      params: [
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({ patientId: PatientId }),
        },
      ],
      connection,
    });

    let investigationResults = investigationGetResult?.recordsets[0];

    if (Array.isArray(investigationResults)) {
      for (let i = 0; i < investigationResults.length; i++) {
        if (investigationResults[i].InvestigationResults) {
          investigationResults[i].InvestigationResults = JSON.parse(
            investigationResults[i].InvestigationResults
          );
        }
        if (investigationResults[i].InvestigationResultDocuments) {
          investigationResults[i].InvestigationResultDocuments = JSON.parse(
            investigationResults[i].InvestigationResultDocuments
          );
        }
      }
    }

    handleResponse(
      res,
      200,
      "success",
      "Investigations retrieved",
      investigationResults
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not load investigations", error);
  }
};

export const handleUploadedFile = async (req, res) => {
  try {
    const filename = req.file ? req.file.filename : null;

    if (!filename) {
      return handleError(
        res,
        500,
        "error",
        "Could not upload investigation results document",
        error
      );
    }

    return handleResponse(
      res,
      200,
      "success",
      "Investigation result document uploaded!",
      {
        filename,
      }
    );
  } catch (error) {
    return handleError(
      res,
      500,
      "error",
      "Could not upload investigation results document",
      error
    );
  }
};
