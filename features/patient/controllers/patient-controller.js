import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";
import dotenv from "dotenv";

dotenv.config();

export const updatePatientEmailAddress = async (req, res, next) => {
  try {
    const { PatientId, EmailAddress, UserSaved } = req.body;

    let connection = req.app.locals.db;

    let patientEmailUpdateResult = await executeSp({
      spName: "PatientEmailUpdate",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({ patientId: PatientId }),
        },
        {
          name: "EmailAddress",
          type: sql.TYPES.NVarChar(200),
          value: EmailAddress,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    patientEmailUpdateResult = patientEmailUpdateResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Patient email updated successfully",
      patientEmailUpdateResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};


export const getPatientEmailAddress = async (req, res, next) => {
    try {
      const { PatientId } = req.body;

      let connection = req.app.locals.db;

      let patientEmailGetResult = await executeSp({
        spName: "PatientEmailGet",
        params: [
          {
            name: "PatientId",
            type: sql.TYPES.Int,
            value: deHashPatientId({ patientId: PatientId }),
          },

        ],
        connection,
      });
      patientEmailGetResult = patientEmailGetResult?.recordsets[0][0];

      handleResponse(
        res,
        200,
        "success",
        "Patient email retrived successfully",
        patientEmailGetResult
      );
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientDeactivateAccount = async (req, res, next) => {
    try {
      const { patientId } = req.body;

      Validation.entityId({ name: "Id", value: patientId });

      let connection = req.app.locals.db;
      const deactivatePatientQuery = `UPDATE [MedicaClinic].[dbo].[Patients]
                                  SET [IsDeleted] = 1,
                                  [FirstName] = CONCAT('D',FirstName),
                                  [LastName] = CONCAT('D',LastName),
                                  [Mobile] = CONCAT('D',Mobile),
                                  [UniqueId] = CONCAT('D',UniqueId),
                                  [NIC] = CONCAT('D',NIC),
                                  [Passport] = CONCAT('D',Passport)
                                  WHERE	Id = ${patientId}`;

      let patientDeactivationResult = await executeQuery({
        query: deactivatePatientQuery,
        connection,
      });

      patientDeactivationResult = patientDeactivationResult.recordsets[0];
      handleResponse(
          response,
          200,
          "success",
          "Patient account deactivated successfully!",
          patientDeactivationResult
      );
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientDeleteAccount = async (req, res, next) => {
    try {
      const { patientId } = req.body;

      Validation.entityId({ name: "Id", value: patientId });

      let connection = req.app.locals.db;
      const deactivatePatientQuery = `UPDATE [MedicaClinic].[dbo].[Patients]
                                   SET [IsDeleted] = 1,
                                   [FirstName] = CONCAT('D',FirstName),
                                   [LastName] = CONCAT('D',LastName),
                                   [Mobile] = CONCAT('D',Mobile),
                                   [UniqueId] = CONCAT('D',UniqueId),
                                   [NIC] = CONCAT('D',NIC),
                                   [Passport] = CONCAT('D',Passport)
                                   WHERE	Id = ${patientId}`;

      let patientDeactivationResult = await executeQuery({
        query: deactivatePatientQuery,
        connection,
      });

      patientDeactivationResult = patientDeactivationResult.recordsets[0];
      handleResponse(
          response,
          200,
          "success",
          "Patient account deleted successfully!",
          patientDeactivationResult
      );
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientAllergyDrug = async (req, res, next) => {
    try {
      let connection = req.app.locals.db;
      const { patientId } = req.body;
      const allergiesQuery = `SELECT	
      PAD.Id AS id, 
      PAD.PatientId AS patientId, 
      PAD.AllergyDrugId AS allergyDrugId, 
      AD.Name AS name, 
      PAD.Comments AS comments, 
      PAD.Status AS status
			FROM	PatientAllergyDrugs PAD
			INNER JOIN AllergyDrugs AD ON PAD.AllergyDrugId = AD.Id
			WHERE	PAD.PatientId = ${patientId} AND PAD.IsDeleted = 0
    `;
      let drugAllergiesResult = await executeQuery({
        query: allergiesQuery,
        connection,
      });
      drugAllergiesResult = drugAllergiesResult.recordsets[0];
      handleResponse(
          response,
          200,
          "success",
          "Allergies retrived successfully",
          drugAllergiesResult
      );
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientAllergyDrugNew = async (req, res, next) => {
    try {
      let connection = req.app.locals.db;
      const { allergyDrugId, comments, patientId, userSaved } = req.body;
      const newDrugAllergyQuery = `INSERT INTO PatientAllergyDrugs
           (PatientId
           ,AllergyDrugId
           ,Comments
           ,Status
           ,IsDeleted
           ,UserCreated
           ,DateCreated)
     VALUES
           (${patientId}
           ,${allergyDrugId}
           ,'${comments}'
           ,1
           ,0
           ,${userSaved}
           ,Utils.dbo.GetCurrentDateTime())`;

      // const patientUpdateQuery = `
      // UPDATE	Patients
      // SET		AllergyStatus = 2
      // WHERE	Id = ${patientId}`;

      let drugAllergiesResult = await executeQuery({
        query: newDrugAllergyQuery,
        connection,
      });
      // let patientUpdateResult = await executeQuery({
      //   query: patientUpdateQuery,
      //   connection,
      // });
      drugAllergiesResult = drugAllergiesResult;
      handleResponse(response, 200, "success", "Allergy added", drugAllergiesResult);
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientAllergyDrugRemove = async (req, res, next) => {
    try {
      let connection = req.app.locals.db;
      const { allergyDrugId, patientId } = req.body;
      if (patientId === undefined || patientId === null || patientId === "") {
        throw new Error("Patient id is required");
      }
      const removeDrugAllergyQuery = `
    UPDATE PatientAllergyDrugs
    SET IsDeleted = 1
    WHERE PatientId = ${patientId} AND AllergyDrugId = ${allergyDrugId} AND IsDeleted = 0`;

      let drugAllergiesResult = await executeQuery({
        query: removeDrugAllergyQuery,
        connection,
      });

      drugAllergiesResult = drugAllergiesResult;
      handleResponse(response, 200, "success", "Allergy removed", drugAllergiesResult);
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientAllergyFood = async (req, res, next) => {
    try {
      let connection = req.app.locals.db;
      const { patientId } = req.body;
      const allergiesQuery = `
    SELECT	Id as id, 
    PatientId as patientId,
    AllergyFoods as allergyFoods,
    Status as status 
		FROM	PatientNewAllergyFoods
		WHERE	PatientId = ${patientId} AND IsDeleted = 0
    `;
      let foodAllergiesResult = await executeQuery({
        query: allergiesQuery,
        connection,
      });
      foodAllergiesResult = foodAllergiesResult.recordsets[0];
      handleResponse(
          response,
          200,
          "success",
          "Allergies retrived successfully",
          foodAllergiesResult
      );
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientAllergyFoodUpdate = async (req, res, next) => {
    try {
      let connection = req.app.locals.db;
      const { patientId, foodAllergies } = req.body;

      if (patientId === undefined || patientId === null || patientId === "") {
        throw new Error("Patient id is required");
      }

      let allergiesQuery = `
    SELECT	Id as id, 
    PatientId as patientId,
    AllergyFoods as allergyFoods,
    Status as status 
		FROM	PatientNewAllergyFoods
		WHERE	PatientId = ${patientId} AND IsDeleted = 0
    `;
      let foodAllergiesResult = await executeQuery({
        query: allergiesQuery,
        connection,
      });
      foodAllergiesResult = foodAllergiesResult.recordsets[0];

      if (foodAllergiesResult.length > 0) {
        const updateQuery = `
      UPDATE PatientNewAllergyFoods
      SET AllergyFoods = '${foodAllergies}'
      WHERE PatientId = ${patientId} AND IsDeleted = 0
      `;
        let updateResult = await executeQuery({
          query: updateQuery,
          connection,
        });
        foodAllergiesResult = updateResult;
      } else {
        const insertQuery = `
      INSERT INTO PatientNewAllergyFoods
      (PatientId, AllergyFoods, Status, IsDeleted, UserCreated, DateCreated)
      VALUES
      (${patientId}, '${foodAllergies}', 1, 0, 14, Utils.dbo.GetCurrentDateTime())
      `;
        let insertResult = await executeQuery({
          query: insertQuery,
          connection,
        });
        foodAllergiesResult = insertResult;
      }

      handleResponse(
          response,
          200,
          "success",
          "Allergies updated successfully",
          foodAllergiesResult
      );
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientSurgicalHistory = async (req, res, next) => {
    try {
      const connection = req.app.locals.db;
      const { patientId } = req.body;
      let surgicalHistoryQuery = `
      SELECT	Id as id, PatientId as patientId, Surgeries as surgeries, Status as status
			FROM	PatientNewSurgeries
			WHERE   IsDeleted = 0 and PatientId=${patientId}`;

      let surgicalHistoryResult = await executeQuery({
        query: surgicalHistoryQuery,
        connection,
      });
      surgicalHistoryResult = surgicalHistoryResult.recordsets[0];
      const formattedResult = {};

      if (surgicalHistoryResult.length >= 1) {
        surgicalHistoryResult = surgicalHistoryResult[0];
        let surgeries = surgicalHistoryResult.surgeries;
        let splittedSurgeries = surgeries.split(";");
        const surgeriesArray = [];
        if (splittedSurgeries.length > 0) {
          splittedSurgeries.forEach((element) => {
            if (element === "") return;
            let splittedElemenet = element.split(",");
            surgeriesArray.push({
              id: splittedElemenet[0],
              name: splittedElemenet[1],
            });
          });
        }
        formattedResult.id = surgicalHistoryResult.id;
        formattedResult.patientId = surgicalHistoryResult.patientId;
        formattedResult.status = surgicalHistoryResult.status;
        formattedResult.surgeries = surgeriesArray;
      } else {
        formattedResult.id = -1;
        formattedResult.patientId = patientId;
        formattedResult.status = -1;
        formattedResult.surgeries = [];
      }

      handleResponse(response, 200, "success", "Surgeries retrived", formattedResult);
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
export const patientSurgicalHistoryUpdate = async (req, res, next) => {
    try {
      const connection = req.app.locals.db;
      const { surgicalHistoryId, patientId, surgeries } = req.body;

      if (patientId === undefined || patientId === null || patientId === "") {
        throw new Error("patient id is required");
      }
      if (
          surgicalHistoryId === undefined ||
          surgicalHistoryId === null ||
          surgicalHistoryId === ""
      ) {
        throw new Error("surgical history id is required");
      }
      if (surgeries === undefined || surgeries === null) {
        throw new Error("surgeries are required");
      }

      if (surgicalHistoryId !== -1) {
        let updateQuery = `
        UPDATE  PatientNewSurgeries
			  SET Surgeries = '${surgeries}',
				UserModified = 14, DateModified = GETDATE()
			  WHERE Id = ${surgicalHistoryId} AND PatientId = ${patientId} AND IsDeleted = 0`;

        let updateResult = await executeQuery({
          query: updateQuery,
          connection,
        });

        handleResponse(response, 200, "success", "Surgeries updated", updateResult);
      } else {
        let insertQuery = `
        INSERT
        INTO	PatientNewSurgeries(PatientId, Surgeries, Status, IsDeleted, UserCreated, DateCreated)
        VALUES  (${patientId}, '${surgeries}', 1, 0, 14 , GETDATE())`;

        let insertResult = await executeQuery({
          query: insertQuery,
          connection,
        });
        handleResponse(response, 200, "success", "Surgeries inserted", insertResult);
      }
    } catch (error) {
      console.log(error);
      handleError(res, 500, "error", "Something went wrong", error);
    }
};
