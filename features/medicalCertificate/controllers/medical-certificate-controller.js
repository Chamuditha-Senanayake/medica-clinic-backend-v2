import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";

export const saveMedicalCertificate = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      Id,
      AppointmentId,
      ResidentialAddress,
      Employment,
      NatureOfDiesease,
      RecommendedDays,
      LeaveWithEffectFrom,
      Remark,
      IssuingDate,
      Status,
      UserSaved,
      PatientId,
    } = req.body;

    const saveMedicalCertificateResult = await executeSp({
      spName: "MedicalCertificateSaveV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: AppointmentId,
        },
        {
          name: "ResidentialAddress",
          type: sql.TYPES.NVarChar(500),
          value: ResidentialAddress,
        },
        {
          name: "Employment",
          type: sql.TYPES.NVarChar(100),
          value: Employment,
        },
        {
          name: "NatureOfDiesease",
          type: sql.TYPES.NVarChar(600),
          value: NatureOfDiesease,
        },
        {
          name: "RecommendedDays",
          type: sql.TYPES.Int,
          value: RecommendedDays,
        },
        {
          name: "Remark",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: Remark,
        },
        {
          name: "LeaveWithEffectFrom",
          type: sql.TYPES.Date,
          value: LeaveWithEffectFrom,
        },
        {
          name: "IssuingDate",
          type: sql.TYPES.Date,
          value: IssuingDate,
        },
        {
          name: "Status",
          type: sql.TYPES.TinyInt,
          value: Status,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
      ],
      connection,
    });
    let medicalCertificate = Array.isArray(
      saveMedicalCertificateResult?.recordsets[0]
    )
      ? saveMedicalCertificateResult?.recordsets[0][0]
      : saveMedicalCertificateResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Medical certificate saved",
      medicalCertificate
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical certificate", error);
  }
};

export const getMedicalCertificate = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { PatientId, UserId , Id} = req.body;

    const saveMedicalCertificateResult = await executeSp({
      spName: "MedicalCertificateGet",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id || 0,
        },
      ],
      connection,
    });
    let medicalCertificate = saveMedicalCertificateResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Medical certificate retrieved",
      medicalCertificate
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "Could not retrieve medical certificate",
      error
    );
  }
};
