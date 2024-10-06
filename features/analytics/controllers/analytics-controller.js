import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";

export const appointmentsToday = async (req, res, next) => {
  try {
    const { InstituteIds, BranchIds, DoctorIds, FromDate, ToDate } = req.body;

    let connection = req.app.locals.db;

    let appointmentsTodayResult = await executeSp({
      spName: "Analytic.AppointmentsToday",
      params: [
        {
          name: "InstituteIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(InstituteIds) ? InstituteIds.join(",") : "",
        },
        {
          name: "BranchesIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(BranchIds) ? BranchIds.join(",") : "",
        },
        {
          name: "DoctorsIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(DoctorIds) ? DoctorIds.join(",") : "",
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: FromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: ToDate,
        },
      ],
      connection,
    });
    appointmentsTodayResult = appointmentsTodayResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      appointmentsTodayResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const patientsToday = async (req, res, next) => {
  try {
    const { InstituteIds, BranchIds, DoctorIds, FromDate, ToDate } = req.body;

    let connection = req.app.locals.db;

    let patientsTodayResult = await executeSp({
      spName: "Analytic.PatientsToday",
      params: [
        {
          name: "InstituteIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(InstituteIds) ? InstituteIds.join(",") : "",
        },
        {
          name: "BranchesIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(BranchIds) ? BranchIds.join(",") : "",
        },
        {
          name: "DoctorsIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(DoctorIds) ? DoctorIds.join(",") : "",
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: FromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: ToDate,
        },
      ],
      connection,
    });
    patientsTodayResult = patientsTodayResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      patientsTodayResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const patientRegistrations = async (req, res, next) => {
  try {
    const { InstituteIds, BranchIds, DoctorIds, FromDate, ToDate } = req.body;

    let connection = req.app.locals.db;

    let patientsTodayResult = await executeSp({
      spName: "Analytic.PatientRegistrations",
      params: [
        {
          name: "InstituteIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(InstituteIds) ? InstituteIds.join(",") : "",
        },
        {
          name: "BranchesIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(BranchIds) ? BranchIds.join(",") : "",
        },
        {
          name: "DoctorsIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(DoctorIds) ? DoctorIds.join(",") : "",
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: FromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: ToDate,
        },
      ],
      connection,
    });
    patientsTodayResult = patientsTodayResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      patientsTodayResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const totalCollections = async (req, res, next) => {
  try {
    const { InstituteIds, BranchIds, DoctorIds } = req.body;

    let connection = req.app.locals.db;

    let totalCollectionsResult = await executeSp({
      spName: "Analytic.TotalCollections",
      params: [
        {
          name: "InstituteIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(InstituteIds) ? InstituteIds.join(",") : "",
        },
        {
          name: "BranchesIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(BranchIds) ? BranchIds.join(",") : "",
        },
        {
          name: "DoctorsIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(DoctorIds) ? DoctorIds.join(",") : "",
        }
      ],
      connection,
    });
    totalCollectionsResult = totalCollectionsResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      totalCollectionsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const bookingsByType = async (req, res, next) => {
  try {
    const { InstituteIds, BranchIds, DoctorIds ,FromDate,ToDate, BookingType} = req.body;

    let connection = req.app.locals.db;

    let bookingsByTypeResult = await executeSp({
      spName: "Analytic.BookingsTodayByType",
      params: [
        {
          name: "InstituteIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(InstituteIds) ? InstituteIds.join(",") : "",
        },
        {
          name: "BranchesIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(BranchIds) ? BranchIds.join(",") : "",
        },
        {
          name: "DoctorsIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(DoctorIds) ? DoctorIds.join(",") : "",
        },
        {
          name: "BookingType",
          type: sql.TYPES.NVarChar(50),
          value: BookingType,
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: FromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: ToDate,
        },
      ],
      connection,
    });
    bookingsByTypeResult = bookingsByTypeResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      bookingsByTypeResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
