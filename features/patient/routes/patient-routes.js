import { Router } from "express";
import {
    getPatientEmailAddress,
    patientAllergyDrug,
    patientAllergyDrugNew,
    patientAllergyDrugRemove,
    patientAllergyFood,
    patientAllergyFoodUpdate,
    patientDeactivateAccount,
    patientDeleteAccount, patientSurgicalHistory, patientSurgicalHistoryUpdate,
    updatePatientEmailAddress
} from "../controllers/patient-controller.js";

const patientRoutes = Router();

patientRoutes.post("/update-patient-email", updatePatientEmailAddress);
patientRoutes.post("/get-patient-email", getPatientEmailAddress);

patientRoutes.post(`/patient/deactivate-account`, patientDeactivateAccount);

patientRoutes.post(`/patient/delete-account`, patientDeleteAccount);

patientRoutes.post(`/patient/allergies/drug`,patientAllergyDrug);

patientRoutes.post(`/patient/allergies/drug/new`,patientAllergyDrugNew);

patientRoutes.post(`/patient/allergies/drug/remove`, patientAllergyDrugRemove);

patientRoutes.post(`/patient/allergies/food`, patientAllergyFood);

patientRoutes.post(`/patient/allergies/food/update`, patientAllergyFoodUpdate);

patientRoutes.post(`/patient/surgical-history`, patientSurgicalHistory);

patientRoutes.post(
    `/patient/surgical-history/update`,
    patientSurgicalHistoryUpdate
);

patientRoutes.post(
    `/patient/profile-picture/new`,
    uploadImage.single("profilePicture"),
    async (request, response, next) => {
        try {
            const uniqueId = request.body.uniqueId;
            await sharp(req.file.buffer)
                // .resize({ width: 250, height: 250 })
                .png()
                .toFile(__dirname + `/patient/profile_images/${uniqueId}.png`);
            handleResponse(response, 200, "success", "Image uploaded successfully", {
                imageName: uniqueId + ".png",
            });
        } catch (error) {
            console.log(error);
            handleError(response, 500, "error", "Something went wrong", error);
            next(error);
        }
    }
);

patientRoutes.post(`/patient/profile-picture`, async (request, response, next) => {
    try {
        //read the image and send it in response
        const { uniqueId } = request.body;
        const imagePath = path.join(
            __dirname,
            `/patient/profile_images/${uniqueId}.png`
        );

        response.writeHead(200, {
            "Content-Type": "image/png",
        });

        fs.readFile(imagePath, function (err, content) {
            response.end(content);
        });
    } catch (error) {}
});

patientRoutes.post(`/patient/medical-history`, async (request, response, next) => {
    try {
        let connection = request.app.locals.db;
        const { patientId } = request.body;

        const medicalHistoryQuery = `
      SELECT	PD.Id AS id, 
      PD.PatientId AS patientId, 
      PD.DiseaseId AS diseaseId, 
      D.Name AS diseaseName, 
      PD.YearFrom AS yearFrom, 
      PD.Comments AS comments, 
      PD.Status AS status
      FROM	PatientDiseases PD
      INNER JOIN Diseases D ON PD.DiseaseId = D.Id
      WHERE PD.PatientId = ${patientId} AND PD.IsDeleted = 0
    `;
        let medicalHistoryResult = await executeQuery({
            query: medicalHistoryQuery,
            connection,
        });
        medicalHistoryResult = medicalHistoryResult.recordsets[0];

        handleResponse(
            response,
            200,
            "success",
            "Medical history retrived successfully",
            medicalHistoryResult
        );
    } catch (error) {
        console.log(error);
        handleError(response, 500, "error", "Something went wrong", error);
        next(error);
    }
});

patientRoutes.post(`/patient/medical-history/new`, async (request, response, next) => {
    try {
        let connection = request.app.locals.db;
        const { patientId, diseaseId, comments, yearFrom } = request.body;

        const newMedicalHistoryQuery = `
      INSERT INTO PatientDiseases
      (PatientId, DiseaseId, YearFrom, Comments, Status, IsDeleted, UserCreated, DateCreated)
      VALUES
      (${patientId}, ${diseaseId}, ${yearFrom}, '${comments}', 1, 0, 14, Utils.dbo.GetCurrentDateTime())
    `;
        let newMedicalHistoryResult = await executeQuery({
            query: newMedicalHistoryQuery,
            connection,
        });

        handleResponse(
            response,
            200,
            "success",
            "Medical history added successfully",
            newMedicalHistoryResult
        );
    } catch (error) {
        console.log(error);
        handleError(response, 500, "error", "Something went wrong", error);
        next(error);
    }
});

patientRoutes.post(
    `/patient/medical-history/remove`,
    async (request, response, next) => {
        try {
            let connection = request.app.locals.db;
            const { patientId, diseaseId } = request.body;

            if (patientId === undefined || patientId === null || patientId === "") {
                throw new Error("Patient id is required");
            }

            if (diseaseId === undefined || diseaseId === null || diseaseId === "") {
                throw new Error("Disease id is required");
            }

            const removeMedicalHistoryQuery = `
      UPDATE PatientDiseases
      SET IsDeleted = 1
      WHERE PatientId = ${patientId} AND DiseaseId = ${diseaseId} AND IsDeleted = 0
      `;
            let removeMedicalHistoryResult = await executeQuery({
                query: removeMedicalHistoryQuery,
                connection,
            });

            handleResponse(
                response,
                200,
                "success",
                "Medical history added successfully",
                removeMedicalHistoryResult
            );
        } catch (error) {
            console.log(error);
            handleError(response, 500, "error", "Something went wrong", error);
            next(error);
        }
    }
);


patientRoutes.post(`/patient/allergies/other`, async (request, response, next) => {
    try {
        let connection = request.app.locals.db;
        const { patientId } = request.body;
        const allergiesQuery = `
      SELECT	Id as id, PatientId as patientId, Allergies as allergies, Status as status
			FROM	PatientOtherAllergies
			WHERE	PatientId = ${patientId} AND IsDeleted = 0`;
        let otherAllergiesResult = await executeQuery({
            query: allergiesQuery,
            connection,
        });
        otherAllergiesResult = otherAllergiesResult.recordset;
        if (otherAllergiesResult.length >= 1) {
            otherAllergiesResult = otherAllergiesResult[0];
        } else {
            otherAllergiesResult = {
                id: -1,
                patientId: patientId,
                allergies: "",
                status: -1,
            };
        }

        handleResponse(
            response,
            200,
            "success",
            "Allergies retrived successfully",
            otherAllergiesResult
        );
    } catch (error) {
        console.log(error);
        handleError(response, 500, "error", "Something went wrong", error);
        next(error);
    }
});

patientRoutes.post(`/patient/medical-history/other`, async (request, response, next) => {
    try {
        let connection = request.app.locals.db;
        const { patientId } = request.body;
        const diseaseQuery = `
      SELECT	Id as id, PatientId as patientId, Diseases as diseases, Status as status
			FROM	PatientOtherDiseases
			WHERE	PatientId = ${patientId} AND IsDeleted = 0`;
        let otherDiseaseResult = await executeQuery({
            query: diseaseQuery,
            connection,
        });
        otherDiseaseResult = otherDiseaseResult.recordset;
        if (otherDiseaseResult.length >= 1) {
            otherDiseaseResult = otherDiseaseResult[0];
        } else {
            otherDiseaseResult = {
                id: -1,
                patientId: patientId,
                diseases: "",
                status: -1,
            };
        }

        handleResponse(
            response,
            200,
            "success",
            "History retrived successfully",
            otherDiseaseResult
        );
    } catch (error) {
        console.log(error);
        handleError(response, 500, "error", "Something went wrong", error);
        next(error);
    }
});


export default patientRoutes;
