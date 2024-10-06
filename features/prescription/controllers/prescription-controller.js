import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashId, deHashPatientId } from "../../../utils/id-hashing.js";
import fetch from "node-fetch";
import { sendEmailFromCustomAccount } from "../../../utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

export const prescriptionsByPatient = async (req, res, next) => {
  try {
    const { PatientId } = req.body;

    let connection = req.app.locals.db;

    let prescriptionGetResult = await executeSp({
      spName: "PrescriptionsByPatientGet",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({ patientId: PatientId }),
        },
      ],
      connection,
    });
    prescriptionGetResult = prescriptionGetResult?.recordsets[0];

    if (Array.isArray(prescriptionGetResult)) {
      prescriptionGetResult.forEach((prescrption) => {
        if (prescrption.Patient) {
          prescrption.Patient = JSON.parse(prescrption.Patient);
        }
        if (prescrption.Doctor) {
          prescrption.Doctor = JSON.parse(prescrption.Doctor);
        }
        if (prescrption.Allergys) {
          prescrption.Allergys = JSON.parse(prescrption.Allergys);
        } else {
          prescrption.Allergys = [];
        }
        if (prescrption.DrugPlan) {
          prescrption.DrugPlan = JSON.parse(prescrption.DrugPlan);
        } else {
          prescrption.DrugPlan = [];
        }
      });
    }

    handleResponse(
      res,
      200,
      "success",
      "Prescriptions retrived successfully",
      prescriptionGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const prescriptionsByInstituteBranchId = async (req, res, next) => {
  try {
    const { IssuedDate, InstituteBranchId, DoctorId, NurseId } = req.body;

    let connection = req.app.locals.db;

    let prescriptionGetResult = await executeSp({
      spName: "PrescriptionsByInstituteBranch",
      params: [
        {
          name: "IssuedDate",
          type: sql.TYPES.DateTime,
          value: IssuedDate,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "NurseId",
          type: sql.TYPES.Int,
          value: NurseId,
        },
      ],
      connection,
    });
    prescriptionGetResult = prescriptionGetResult?.recordsets[0];

    if (Array.isArray(prescriptionGetResult)) {
      prescriptionGetResult.forEach((prescrption) => {
        if (prescrption.Patient) {
          prescrption.Patient = JSON.parse(prescrption.Patient);
        }
        if (prescrption.Doctor) {
          prescrption.Doctor = JSON.parse(prescrption.Doctor);
        }
        if (prescrption.Allergys) {
          prescrption.Allergys = JSON.parse(prescrption.Allergys);
        } else {
          prescrption.Allergys = [];
        }
        if (prescrption.DrugPlan) {
          prescrption.DrugPlan = JSON.parse(prescrption.DrugPlan);
        } else {
          prescrption.DrugPlan = [];
        }

        if (prescrption.MedicalCertificates) {
          prescrption.MedicalCertificates = JSON.parse(
            prescrption.MedicalCertificates
          );
        }
        if (prescrption.MedicalBills) {
          prescrption.MedicalBills = JSON.parse(prescrption.MedicalBills);
        }
        if (prescrption.ReferralLetters) {
          prescrption.ReferralLetters = JSON.parse(prescrption.ReferralLetters);
        }
      });
    }

    handleResponse(
      res,
      200,
      "success",
      "Prescriptions retrived successfully",
      prescriptionGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getPrescriptionFileName = async (req, res, next) => {
  try {
    const { PrescriptionId } = req.body;

    let connection = req.app.locals.db;

    let prescriptionFileNameGetResult = await executeSp({
      spName: "PrescriptionFileNameGet",
      params: [
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: PrescriptionId,
        },
      ],
      connection,
    });
    prescriptionFileNameGetResult =
      prescriptionFileNameGetResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Prescriptions filename retrived successfully",
      prescriptionFileNameGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const generatePrescriptionFileName = async (req, res, next) => {
  try {
    const { PrescriptionId } = req.body;

    let connection = req.app.locals.db;

    let prescriptionFileNameGetResult = await executeSp({
      spName: "GeneratePrescriptionFileName",
      params: [
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: PrescriptionId,
        },
      ],
      connection,
    });
    prescriptionFileNameGetResult =
      prescriptionFileNameGetResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Prescriptions filename retrived successfully",
      prescriptionFileNameGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sendPrescriptionViaEmail = async (req, res, next) => {
  try {
    const {
      PrescriptionFileName,
      ToEmail,
      PatientTitle,
      PatientFirstName,
      PatientLastName,
      PatientId,
    } = req.body;

    (async () => {
      //fetch prescription file
      const prescriptionFilePath = `${process.env.DOCUMENT_MODULE_URL}/prescription/get-prescription/lk/${PatientId}/${PrescriptionFileName}`;
      const prescriptionFileResponse = await fetch(prescriptionFilePath, {
        method: "GET",
      });
      const pdfData = await prescriptionFileResponse.arrayBuffer(); // Get response body as ArrayBuffer

      const prescriptionFileBuffer = Buffer.from(pdfData);
      const timestamp = new Date() / 1;
      let PatientName = `${PatientTitle} ${PatientFirstName} ${PatientLastName}`;

      sendEmailFromCustomAccount({
        emailUser: process.env.EMAIL_USER,
        emailPassword: process.env.EMAIL_PASSWORD,
        to: ToEmail,
        subject: "Prescription Report",
        html: `</br>
                <p>Dear ${
                  PatientFirstName.length < 3 ? PatientName : PatientFirstName
                },</p>
                <p>Please find the prescription attached to this email.</p>
                <p>If you're unable to download the prescription file, you can click on the link below.</p>
                <p>${prescriptionFilePath}</p>
                <p>Feel free to contact us if you have any questions.</p>
              </br>
                <p>Best regards,</p>
                <p>Thank you,</p>
                <p>Medica Healthcare System</p>
              </div>`,
        attachments: [
          {
            filename: `PrescriptionReport_${PatientName}_${timestamp}.pdf`,
            content: prescriptionFileBuffer,
          },
        ],
      });
    })(); // schedules the email sending and task is executed asynchronously. the response is sent to user without waiting for the task

    handleResponse(
      res,
      200,
      "success",
      "Prescription will be sent shortly",
      {}
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getVitalsFromLastPrescription = async (req, res, next) => {
  try {
    const { PatientId } = req.body;

    let connection = req.app.locals.db;

    let prescriptionGetResult = await executeSp({
      spName: "VitalsFromLastPrescriptionGet",
      params: [
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({ patientId: PatientId }),
        },
      ],
      connection,
    });
    prescriptionGetResult = prescriptionGetResult?.recordsets[0];

    if (Array.isArray(prescriptionGetResult)) {
      prescriptionGetResult.forEach((prescrption) => {
        if (prescrption.Patient) {
          prescrption.Patient = JSON.parse(prescrption.Patient);
        }
        if (prescrption.Doctor) {
          prescrption.Doctor = JSON.parse(prescrption.Doctor);
        }
        if (prescrption.Allergys) {
          prescrption.Allergys = JSON.parse(prescrption.Allergys);
        } else {
          prescrption.Allergys = [];
        }
        if (prescrption.DrugPlan) {
          prescrption.DrugPlan = JSON.parse(prescrption.DrugPlan);
        } else {
          prescrption.DrugPlan = [];
        }
      });
    }
    prescriptionGetResult = prescriptionGetResult[0];

    handleResponse(
      res,
      200,
      "success",
      "Vitals retrived successfully",
      prescriptionGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const savePrescriptionRecord = async (req, res, next) => {
  try {
    const {
      PrescriptionId,
      AppointmentId,
      AppointmentNumber,
      AppointmentSessionId,
      AppointmentStatus,
      Patient,
      Diagnosis,
      PositiveSx,
      NegativeSx,
      RedFlag,
      Note,
      BloodPressureSystolic,
      BloodPressureDiastolic,
      PulseRate,
      Weight,
      Height,
      Temperature,
      WaistCircumference,
      Test,
      AgeYears,
      AgeMonths,
      NextVisitDate,
      FollowUp,
      IllnessData,
      DispositionFollowUp,
      DispositionNote,
      DispositionId,
      DispositionSave,
      Status,
      UserSaved,
      RecordDrugs,
    } = req.body;

    let connection = req.app.locals.db;

    const prescriptionRecordDrugTable = new sql.Table();
    prescriptionRecordDrugTable.columns.add("Id", sql.Int);
    prescriptionRecordDrugTable.columns.add("DrugId", sql.Int);
    prescriptionRecordDrugTable.columns.add("Frequency", sql.NVarChar(50));
    prescriptionRecordDrugTable.columns.add("Duration", sql.NVarChar(20));
    prescriptionRecordDrugTable.columns.add("Quantity", sql.Float);
    prescriptionRecordDrugTable.columns.add("MealTime", sql.NVarChar(100));
    prescriptionRecordDrugTable.columns.add("Note", sql.NVarChar(1000));
    prescriptionRecordDrugTable.columns.add("Weight", sql.NVarChar(10));
    prescriptionRecordDrugTable.columns.add("WeightType", sql.NVarChar(100));
    prescriptionRecordDrugTable.columns.add(
      "Description",
      sql.NVarChar(sql.MAX)
    );
    prescriptionRecordDrugTable.columns.add("Status", sql.TinyInt);

    // Add data to the table object
    // RecordDrugs.forEach((drug) => {
    //   prescriptionRecordDrugTable.rows.add(
    //     drug.Id,
    //     drug.DrugId,
    //     drug.Frequency,
    //     drug.Duration,
    //     drug.Quantity,
    //     drug.MealTime,
    //     drug.Note,
    //     drug.Weight,
    //     drug.WeightType,
    //     drug.Description,
    //     drug.Status
    //   );
    // });

    let prescriptionFileNameGetResult = await executeSp({
      spName: "PrescriptionRecordSaveV2",
      params: [
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: PrescriptionId,
        },
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: AppointmentId,
        },
        {
          name: "AppointmentNumber",
          type: sql.TYPES.Int,
          value: AppointmentNumber,
        },
        {
          name: "AppointmentSessionId",
          type: sql.TYPES.Int,
          value: AppointmentSessionId,
        },
        {
          name: "AppointmentStatus",
          type: sql.TYPES.TinyInt,
          value: AppointmentStatus,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: Patient.Id,
          }),
        },
        {
          name: "PatientTitle",
          type: sql.TYPES.NVarChar(10),
          value: Patient.Title,
        },
        {
          name: "PatientFirstName",
          type: sql.TYPES.NVarChar(50),
          value: Patient.FirstName,
        },
        {
          name: "PatientMiddleName",
          type: sql.TYPES.NVarChar(200),
          value: Patient.MiddleName,
        },
        {
          name: "PatientLastName",
          type: sql.TYPES.NVarChar(50),
          value: Patient.LastName,
        },
        {
          name: "PatientNIC",
          type: sql.TYPES.NVarChar(15),
          value: Patient.NIC,
        },
        {
          name: "PatientPassport",
          type: sql.TYPES.NVarChar(50),
          value: Patient.Passport,
        },
        {
          name: "PatientMobile",
          type: sql.TYPES.NVarChar(15),
          value: Patient.Mobile,
        },
        {
          name: "PatientEmail",
          type: sql.TYPES.NVarChar(200),
          value: Patient.Email,
        },
        {
          name: "PatientDateOfBirth",
          type: sql.TYPES.Date,
          value: Patient.DateOfBirth,
        },
        {
          name: "PatientGender",
          type: sql.TYPES.NVarChar(10),
          value: Patient.Gender,
        },
        {
          name: "PatientParentId",
          type: sql.TYPES.Int,
          value: Patient.ParentId,
        },
        {
          name: "PatientPatientTypeId",
          type: sql.TYPES.Int,
          value: Patient.PatientTypeId,
        },
        {
          name: "PatientBloodGroup",
          type: sql.TYPES.NVarChar(5),
          value: Patient.BloodGroup,
        },
        {
          name: "PatientStatus",
          type: sql.TYPES.TinyInt,
          value: Patient.Status,
        },
        {
          name: "PatientAddressId",
          type: sql.TYPES.Int,
          value: Patient.AddressId,
        },
        {
          name: "Diagnosis",
          type: sql.TYPES.NVarChar(500),
          value: Diagnosis,
        },
        {
          name: "PositiveSx",
          type: sql.TYPES.NVarChar(500),
          value: PositiveSx,
        },
        {
          name: "NegativeSx",
          type: sql.TYPES.NVarChar(500),
          value: NegativeSx,
        },
        {
          name: "RedFlag",
          type: sql.TYPES.NVarChar(500),
          value: RedFlag,
        },
        {
          name: "Note",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: Note,
        },
        {
          name: "BloodPressureSystolic",
          type: sql.TYPES.Float,
          value: BloodPressureSystolic === "" ? null : BloodPressureSystolic,
        },
        {
          name: "BloodPressureDiastolic",
          type: sql.TYPES.Float,
          value: BloodPressureDiastolic === "" ? null : BloodPressureDiastolic,
        },
        {
          name: "PulseRate",
          type: sql.TYPES.Int,
          value: PulseRate === "" ? null : PulseRate,
        },
        {
          name: "Weight",
          type: sql.TYPES.Float,
          value: Weight === "" ? null : Weight,
        },
        {
          name: "Height",
          type: sql.TYPES.Float,
          value: Height === "" ? null : Height,
        },
        {
          name: "Temperature",
          type: sql.TYPES.Float,
          value: Temperature === "" ? null : Temperature,
        },
        {
          name: "WaistCircumference",
          type: sql.TYPES.NVarChar(50),
          value: WaistCircumference === "" ? null : WaistCircumference,
        },
        {
          name: "Test",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: Test,
        },
        {
          name: "AgeYears",
          type: sql.TYPES.Int,
          value: AgeYears,
        },
        {
          name: "AgeMonths",
          type: sql.TYPES.Int,
          value: AgeMonths,
        },
        {
          name: "NextVisitDate",
          type: sql.TYPES.Date,
          value: NextVisitDate,
        },
        {
          name: "FollowUp",
          type: sql.TYPES.NVarChar(200),
          value: FollowUp,
        },
        {
          name: "IllnessData",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: IllnessData,
        },
        {
          name: "DispositionFollowUp",
          type: sql.TYPES.NVarChar(500),
          value: DispositionFollowUp,
        },
        {
          name: "DispositionNote",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: DispositionNote,
        },
        {
          name: "DispositionId",
          type: sql.TYPES.Int,
          value: DispositionId,
        },
        {
          name: "DispositionSave",
          type: sql.TYPES.Bit,
          value: DispositionSave,
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
          name: "PrescriptionRecordDrugs",
          type: sql.TVP("PrescriptionRecordDrugV2"),
          value: prescriptionRecordDrugTable,
        },
      ],
      connection,
    });
    prescriptionFileNameGetResult =
      prescriptionFileNameGetResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Prescriptions filename retrived successfully",
      prescriptionFileNameGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const updatePrescriptionApprovalStatus = async (req, res, next) => {
  try {
    const { PrescriptionId, UserId, ApprovalStatus } = req.body;

    let connection = req.app.locals.db;

    let prescriptionApprovalStatusUpdateResult = await executeSp({
      spName: "PrescriptionApprovalStatusSave",
      params: [
        {
          name: "PrescriptionId",
          type: sql.TYPES.Int,
          value: PrescriptionId,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
        {
          name: "ApprovalStatus",
          type: sql.TYPES.NVarChar(100),
          value: ApprovalStatus,
        },
      ],
      connection,
    });
    prescriptionApprovalStatusUpdateResult =
      prescriptionApprovalStatusUpdateResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Prescriptions approval status updated successfully",
      prescriptionApprovalStatusUpdateResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
