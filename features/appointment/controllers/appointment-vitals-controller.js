import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";

export const addAppointmentVitals = async (req, res) => {
  try {
    const {
      Id,
      AppointmentId,
      PatientId,
      BloodPressureSystolic,
      BloodPressureDiastolic,
      Height,
      Weight,
      Temperature,
      Waist,
      Pulse,
      UserSaved,
    } = req.body;

    let connection = req.app.locals.db;

    let addAppointmentVitalsResult = await executeSp({
      spName: "Vital.AppointmentVitalsSave",
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
          name: "PatientId",
          type: sql.TYPES.Int,
          value: PatientId,
        },
        {
          name: "BloodPressureSystolic",
          type: sql.TYPES.Float,
          value: BloodPressureSystolic,
        },
        {
          name: "BloodPressureDiastolic",
          type: sql.TYPES.Float,
          value: BloodPressureDiastolic,
        },
        {
          name: "Height",
          type: sql.TYPES.Float,
          value: Height,
        },
        {
          name: "Weight",
          type: sql.TYPES.Float,
          value: Weight,
        },
        {
          name: "Temperature",
          type: sql.TYPES.Float,
          value: Temperature,
        },
        {
          name: "Waist",
          type: sql.TYPES.Float,
          value: Waist,
        },
        {
          name: "Pulse",
          type: sql.TYPES.Float,
          value: Pulse,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    addAppointmentVitalsResult = addAppointmentVitalsResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      `Appointment Vitals ${Id === 0 ? "Added" : "Updated"} Successfully`,
      addAppointmentVitalsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getAppointmentVitals = async (req, res) => {
  try {
    const { Id, AppointmentId, PatientId } = req.body;

    let connection = req.app.locals.db;

    let getAppointmentVitalsResult = await executeSp({
      spName: "Vital.AppointmentVitalsGet",
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
          name: "PatientId",
          type: sql.TYPES.Int,
          value: PatientId,
        },
      ],
      connection,
    });
    getAppointmentVitalsResult = getAppointmentVitalsResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Appointment Vitals Retrived Successfully",
      getAppointmentVitalsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const addVitalsFromVeyetals = async (req, res) => {
  try {
    const {
      Id,
      PatientId,
      Height,
      Weight,
      HeartRate,
      HeartRateVariability,
      OxygenSaturation,
      RespirationRate,
      BloodPressureSystolic,
      BloodPressureDiastolic,
      FastingBloodSugarGlucose,
      RandomBloodSugarGlucose,
      StressLevel,
      UserId,
    } = req.body;

    let connection = req.app.locals.db;

    let addVitalsFromVevytalsResult = await executeSp({
      spName: "Vital.VitalsFromvVeyetalsSave",
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
          name: "Height",
          type: sql.TYPES.Float,
          value: Height,
        },
        {
          name: "Weight",
          type: sql.TYPES.Float,
          value: Weight,
        },
        {
          name: "HeartRate",
          type: sql.TYPES.Int,
          value: HeartRate,
        },
        {
          name: "HeartRateVariability",
          type: sql.TYPES.Float,
          value: HeartRateVariability,
        },
        {
          name: "OxygenSaturation",
          type: sql.TYPES.Int,
          value: OxygenSaturation,
        },
        {
          name: "RespirationRate",
          type: sql.TYPES.Int,
          value: RespirationRate,
        },
        {
          name: "BloodPressureSystolic",
          type: sql.TYPES.Int,
          value: BloodPressureSystolic,
        },
        {
          name: "BloodPressureDiastolic",
          type: sql.TYPES.Int,
          value: BloodPressureDiastolic,
        },
        {
          name: "FastingBloodSugarGlucose",
          type: sql.TYPES.Int,
          value: FastingBloodSugarGlucose,
        },
        {
          name: "RandomBloodSugarGlucose",
          type: sql.TYPES.Int,
          value: RandomBloodSugarGlucose,
        },
        {
          name: "StressLevel",
          type: sql.TYPES.NVarChar(100),
          value: StressLevel,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });
    addVitalsFromVevytalsResult = addVitalsFromVevytalsResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      `Veyetals Vitals ${Id === 0 ? "Added" : "Updated"} Successfully`,
      addVitalsFromVevytalsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getVeyetalVitals = async (req, res) => {
  try {
    const { PatientId } = req.body;

    let connection = req.app.locals.db;

    let getVeyetalsVitalsResult = await executeSp({
      spName: "Vital.VitalsFromvVeyetalsGet",
      params: [
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
    getVeyetalsVitalsResult = getVeyetalsVitalsResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Veyetals Vitals Retrived Successfully",
      getVeyetalsVitalsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getPatientVitals = async (req, res) => {
  try {
    const { PatientId } = req.body;

    let connection = req.app.locals.db;

    let getVitalsResult = await executeSp({
      spName: "Vital.PatientVitalsGet",
      params: [
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
    getVitalsResult = getVitalsResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Vitals Retrived Successfully",
      getVitalsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const patientVitalChart = async (req, res) => {
  try {
    const { From, To, EnteredBy, Vital, GroupBy, PatientId } = req.body;

    let connection = req.app.locals.db;

    let vitalGraphResults = await executeSp({
      spName: "Vital.VitalGraphGet",
      params: [
        {
          name: "From",
          type: sql.TYPES.DateTime,
          value: From,
        },
        {
          name: "To",
          type: sql.TYPES.DateTime,
          value: To,
        },
        {
          name: "Vital",
          type: sql.TYPES.NVarChar(100),
          value: Vital,
        },
        {
          name: "GroupBy",
          type: sql.TYPES.NVarChar(100),
          value: GroupBy,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "EnteredBy",
          type: sql.TYPES.NVarChar(100),
          value: EnteredBy,
        },
      ],
      connection,
    });
    vitalGraphResults = vitalGraphResults?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Vitals Graph Retrived Successfully",
      vitalGraphResults
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
