import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { deHashPatientId } from "../../../utils/id-hashing.js";

export const doctorNoteSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { PatientId, DoctorId, Id, Note, UserId } = req.body;

    let doctorNoteSaveResult = await executeSp({
      spName: "DoctorNoteSave",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "Note",
          type: sql.TYPES.Text,
          value: Note,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });

    doctorNoteSaveResult = doctorNoteSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      doctorNoteSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const doctorNoteGetByDoctorAndPatientId = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { PatientId, DoctorId } = req.body;

    let doctorNoteGetResult = await executeSp({
      spName: "DoctorNoteGet",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
      ],
      connection,
    });

    doctorNoteGetResult = doctorNoteGetResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      doctorNoteGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
