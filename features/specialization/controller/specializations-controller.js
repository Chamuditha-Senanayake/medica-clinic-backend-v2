import dotenv from "dotenv";
import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import executeQuery from "../../../db/executeQuery.js";

dotenv.config();

export const getSpecializationsByInstituteBranch = async (req, res, next) => {
  try {
    const { InstituteBranchId } = req.body;

    let connection = req.app.locals.db;

    let specializationsByInstituteBranchIdResult = await executeSp({
      spName: "SpecializationsByInstituteBranchGet",
      params: [
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
      ],
      connection,
    });

    specializationsByInstituteBranchIdResult =
      specializationsByInstituteBranchIdResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      specializationsByInstituteBranchIdResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const updateSpecialization = async (req, res, next) => {
  try {

    let connection = req.app.locals.db;
    const { specializationId, specializationName } = req.body;
    if (
        specializationId == null ||
        specializationId == undefined ||
        specializationId == ""
    ) {
      throw new Error("Specialization id is required");
    }

    const query = `UPDATE [MedicaClinic].[dbo].[Specializations]
                   SET [Name] = N'${specializationName}'
                   WHERE [Id] = ${specializationId}`;

    let result = await executeQuery({
      query: query,
      connection,
    });

    handleResponse(response, 200, "success", "Updated successfully", result);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const getAllSpecialization = async (req, res, next) => {
  try {

    let connection = req.app.locals.db;
    const query = `SELECT * FROM Specializations WHERE IsDeleted = 0`;

    let result = await executeQuery({
      query: query,
      connection,
    });
    result = result.recordsets[0];

    handleResponse(response, 200, "success", "Data retrived", result);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
