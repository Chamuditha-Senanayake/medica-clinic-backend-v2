import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { deHashPatientId } from "../../../utils/id-hashing.js";

export const getReferralLetters = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, PatientId, DoctorId } = req.body;

    let referralLetterGetResult = await executeSp({
      spName: "ReferralLetterGetV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: PatientId ? deHashPatientId({ patientId: PatientId }) : null,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
      ],
      connection,
    });

    referralLetterGetResult = referralLetterGetResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Referral letters retrived successfully",
      referralLetterGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
