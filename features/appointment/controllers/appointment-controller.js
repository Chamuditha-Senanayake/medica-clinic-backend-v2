import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";
import moment from "moment-timezone";

export const getAppointments = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, Number, SessionId, PatientId, PatientMobile } = req.body;
    let appointmentList = await executeSp({
      spName: "AppointmentGetV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "Number",
          type: sql.TYPES.Int,
          value: Number,
        },
        {
          name: "SessionId",
          type: sql.TYPES.Int,
          value: SessionId,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "PatientMobile",
          type: sql.TYPES.Int,
          value: PatientMobile,
        },
      ],
      connection,
    });

    appointmentList = appointmentList?.recordsets[0];

    handleResponse(res, 200, "success", "Operation Success", appointmentList);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const saveUpdateAppointment = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      Number,
      SessionId,
      PatientId,
      Status,
      UserId,
      Id,
      IsFollowUp,
      Description,
      EnableAutoBillGenerate,
    } = req.body;

    console.log(
      "/appointments/appointment-save-or-update",
      JSON.stringify({
        Number,
        SessionId,
        PatientId,
        Status,
        UserId,
        Id,
        IsFollowUp,
        Description,
        EnableAutoBillGenerate,
        TimeStamp: moment().tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss"),
      })
    );

    let appointmentSaveResult = await executeSp({
      spName: "AppointmentSaveV2",
      params: [
        {
          name: "Number",
          type: sql.TYPES.Int,
          value: Number,
        },
        {
          name: "SessionId",
          type: sql.TYPES.Int,
          value: SessionId,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "Status",
          type: sql.TYPES.TinyInt,
          value: Status,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserId,
        },

        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "IsFollowUp",
          type: sql.TYPES.Bit,
          value: IsFollowUp,
        },
        {
          name: "EnableAutoBillGenerate",
          type: sql.TYPES.Bit,
          value: EnableAutoBillGenerate,
        },
        {
          name: "Description",
          type: sql.TYPES.NVarChar(50),
          value: Description,
        },
      ],
      connection,
    });

    appointmentSaveResult = appointmentSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Appointment placed successfully",
      appointmentSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "An error occurred while placing appointment",
      error
    );
  }
};

export const appointmentsForSms = async (req, res, next) => {
  try {
    const { instituteIds, branchIds, doctorIds, fromDate, toDate } = req.body;
    // console.log(branchId, doctorId, fromDate, toDate, userId);
    let connection = req.app.locals.db;

    const appointmentsForSMSSend = await executeSp({
      spName: "AppointmentsForSMSGet",
      params: [
        {
          name: "InstituteIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(instituteIds) ? instituteIds.join(",") : "",
        },
        {
          name: "BranchesIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(branchIds) ? branchIds.join(",") : "",
        },
        {
          name: "DoctorsIds",
          type: sql.TYPES.NVarChar(100),
          value: Array.isArray(doctorIds) ? doctorIds.join(",") : "",
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: fromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: toDate,
        },
      ],
      connection,
    });
    let appointments = appointmentsForSMSSend?.recordsets[0];
    appointments.forEach((data) => {
      data.AppointmentList = JSON.parse(data.AppointmentList);
    });

    handleResponse(res, 200, "sucess", "data retrived", appointments);
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "An error occurred while placing appointment",
      error
    );
  }
};
export const savePatientResponse = async (req, res, next) => {
  try {
    const { UserId, AppointmentId, PatientResponse } = req.body;

    if (UserId === null || UserId === undefined || UserId === "") {
      throw new Error("UserId id is required");
    }

    if (
      AppointmentId === null ||
      AppointmentId === undefined ||
      AppointmentId === ""
    ) {
      throw new Error("AppointmentId id is required");
    }

    let connection = req.app.locals.db;

    let patientResponseSaveResult = await executeSp({
      spName: "SavePatientResponse",
      params: [
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: AppointmentId,
        },
        {
          name: "PatientResponse",
          type: sql.TYPES.NVarChar(50),
          value: PatientResponse,
        },

        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });
    patientResponseSaveResult = patientResponseSaveResult?.recordsets[0][0];

    handleResponse(
      req,
      200,
      "success",
      "Operation Success",
      patientResponseSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "An error occurred while placing appointment",
      error
    );
  }
};
export const appointmentReport = async (req, res, next) => {
  try {
    const { branchId, doctorId, fromDate, toDate, userId } = req.body;
    // console.log(branchId, doctorId, fromDate, toDate, userId);
    let connection = req.app.locals.db;

    const appointmentReport = await executeSp({
      spName: "AppointmentReportUpdated",
      params: [
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId,
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: fromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: toDate,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId,
        },
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: branchId,
        },
      ],
      connection,
    });
    let reportData = appointmentReport?.recordsets[0];
    reportData.forEach((data) => {
      data.BillItems = JSON.parse(data.BillItems);
      if (data?.BillRemarks) {
        data.BillRemarks = JSON.parse(data?.BillRemarks);
      } else {
        data.BillRemarks = [];
      }
      if (Array.isArray(data?.BillItems) && data?.BillItems.length > 0) {
        data.IsInitialBill = false;
        for (let i = 0; i < data.BillItems.length; i++) {
          if (
            data.BillItems[i].ItemName === "Doctor fee" ||
            data.BillItems[i].ItemName === "Hospital fee"
          ) {
            data.IsInitialBill = true;
            break;
          }
        }
      }
    });

    handleResponse(res, 200, "sucess", "data retrived", reportData);
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "An error occurred while placing appointment",
      error
    );
  }
};
export const appointmentOnGoing = async (req, res, next) => {
  try {
    const { branchId, fromDate, toDate, userId } = req.body;
    let connection = req.app.locals.db;

    if (branchId === null || branchId === undefined || branchId === "") {
      throw new Error("Branch id is required");
    }
    if (fromDate === null || fromDate === undefined || fromDate === "") {
      throw new Error("From date is required");
    }
    if (toDate === null || toDate === undefined || toDate === "") {
      throw new Error("To date is required");
    }
    if (userId === null || userId === undefined || userId === "") {
      throw new Error("User id is required");
    }

    const appointmentOngoingGetResult = await executeSp({
      spName: "AppointmentOngoingGet",
      params: [
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: branchId,
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar,
          value: fromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar,
          value: toDate,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId,
        },
      ],
      connection,
    });

    let response = appointmentOngoingGetResult?.recordsets[0];
    response.forEach((data) => {
      data.Appointments = JSON.parse(data.Appointments);
      // console.log(data.Appointments);
    });

    handleResponse(
      req,
      200,
      "success",
      "All ongoing appointments retrieved successfully",
      response
    );
  } catch (error) {
    console.log(error);
    handleError(
      res,
      500,
      "error",
      "An error occurred while placing appointment",
      error
    );
  }
};
