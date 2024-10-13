import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const getSessionsByDateRange = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { instituteIds, branchIds, doctorIds, fromDate, toDate } = req.body;

    const sessionsByDateRange = await executeSp({
      spName: "SessionsByDateRangeGet",
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
    let sessions = sessionsByDateRange?.recordsets[0];
    sessions.forEach((data) => {
      data.AppointmentList = JSON.parse(data.AppointmentList);
    });

    handleResponse(res, 200, "success", "Session data retrived", sessions);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getSessionsFromAllDoctors = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { FromDate } = req.body;

    let doctorsAndSessions = await executeSp({
      spName: "SessionsFromAllDoctorsGet",
      params: [
        {
          name: "FromDate",
          type: sql.TYPES.DateTime,
          value: FromDate,
        },
      ],
      connection,
    });

    doctorsAndSessions = doctorsAndSessions?.recordsets[0];
    doctorsAndSessions.forEach((data) => {
      if (data.sessions) {
        data.sessions = JSON.parse(data.sessions);
      } else {
        data.sessions = [];
      }
    });

    handleResponse(
      res,
      200,
      "success",
      "Doctor sessions retrived",
      doctorsAndSessions
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getSessionsFromAllDoctorsV2 = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      FromDate,
      Page,
      PageSize,
      InstituteId,
      BranchId,
      DoctorName,
      AvailableNow,
      AvailableInXHours,
      AvailableInXDays,
      FeesHighToLow,
      FeesFrom,
      FeesTo,
    } = req.body;

    let doctorsAndSessions = await executeSp({
      spName: "SessionsFromAllDoctorsGetV2",
      params: [
        {
          name: "FromDate",
          type: sql.TYPES.DateTime,
          value: FromDate,
        },
        {
          name: "DoctorName",
          type: sql.TYPES.NVarChar(50),
          value: DoctorName,
        },
        {
          name: "Page",
          type: sql.TYPES.Int,
          value: Page,
        },
        {
          name: "PageSize",
          type: sql.TYPES.Int,
          value: PageSize,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: InstituteId,
        },
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: BranchId,
        },
        {
          name: "AvailableNow",
          type: sql.TYPES.Bit,
          value: AvailableNow,
        },
        {
          name: "AvailableInXHours",
          type: sql.TYPES.Int,
          value: AvailableInXHours,
        },
        {
          name: "AvailableInXDays",
          type: sql.TYPES.Int,
          value: AvailableInXDays,
        },
        {
          name: "FeesHighToLow",
          type: sql.TYPES.Bit,
          value: FeesHighToLow,
        },
        {
          name: "FeesFrom",
          type: sql.TYPES.Int,
          value: FeesFrom,
        },
        {
          name: "FeesTo",
          type: sql.TYPES.Int,
          value: FeesTo,
        },
      ],
      connection,
    });

    const totalRows = doctorsAndSessions?.recordsets[1][0]?.TotalRows;
    doctorsAndSessions = doctorsAndSessions?.recordsets[0];
    // const totalRows = doctorsAndSessions?.recordsets[1];
    doctorsAndSessions.forEach((data) => {
      if (data.sessions) {
        data.sessions = JSON.parse(data.sessions);
      } else {
        data.sessions = [];
      }
    });

    handleResponse(res, 200, "success", "Doctor sessions retrived", {
      doctorsAndSessions,
      totalRows,
      resultsFrom:
        doctorsAndSessions.length == 0 ? 0 : (Page - 1) * PageSize + 1,
      resultsTo: (Page - 1) * PageSize + doctorsAndSessions.length,
      pages: Math.ceil(totalRows / PageSize),
    });
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const addNewSessionCategory = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Name, UserSaved } = req.body;

    let addNewSessionCategoryResult = await executeSp({
      spName: "SessionCategorySave",
      params: [
        {
          name: "Name",
          type: sql.TYPES.NVarChar(200),
          value: Name,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });

    addNewSessionCategoryResult = addNewSessionCategoryResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      addNewSessionCategoryResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getSessionCategories = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id } = req.body;

    let getSessionCategoryResult = await executeSp({
      spName: "SessionCategoryGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
      ],
      connection,
    });

    getSessionCategoryResult = getSessionCategoryResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      getSessionCategoryResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const saveOrUpdateSession = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      RoomNumber,
      TimeStart,
      TimeEnd,
      SelectedDate,
      DoctorId,
      InstituteBranchId,
      Status,
      Type,
      SessionCategoryId,
      UserSaved,
      Id,
      AppointmentLimit,
      AppointmentReserved,
      SmsConfigs,
      SessionServices = [],
    } = req.body;

    let saveOrUpdateSessionResult = await executeSp({
      spName: "SessionSaveV2",
      params: [
        {
          name: "RoomNumber",
          type: sql.TYPES.Int,
          value: RoomNumber,
        },
        {
          name: "TimeStart",
          type: sql.TYPES.NVarChar(20),
          value: TimeStart,
        },
        {
          name: "TimeEnd",
          type: sql.TYPES.NVarChar(20),
          value: TimeEnd,
        },
        {
          name: "SelectedDate",
          type: sql.TYPES.DateTime,
          value: SelectedDate,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
        {
          name: "Status",
          type: sql.TYPES.Int,
          value: Status,
        },
        {
          name: "Type",
          type: sql.TYPES.Int,
          value: Type,
        },
        {
          name: "SessionCategoryId",
          type: sql.TYPES.Int,
          value: SessionCategoryId,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "AppointmentLimit",
          type: sql.TYPES.Int,
          value: AppointmentLimit,
        },
        {
          name: "AppointmentReserved",
          type: sql.TYPES.Int,
          value: AppointmentReserved,
        },
        {
          name: "SmsConfigs",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: SmsConfigs,
        },
        {
          name: "ServiceIds",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: SessionServices.join(","),
        },
      ],
      connection,
    });

    saveOrUpdateSessionResult = saveOrUpdateSessionResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      saveOrUpdateSessionResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getSessionByDoctorAndInstituteBranch = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { DoctorId, InstituteBranchId } = req.body;

    let getDoctorSessionsResult = await executeSp({
      spName: "SessionsByDoctorAndInstituteBranchGet",
      params: [
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
      ],
      connection,
    });

    getDoctorSessionsResult = getDoctorSessionsResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      getDoctorSessionsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getSessionCategoryBySessionId = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { SessionId } = req.body;

    let getSessionCategoryResult = await executeSp({
      spName: "SessionCategoryBySessionIdGet",
      params: [
        {
          name: "SessionId",
          type: sql.TYPES.Int,
          value: SessionId,
        },
      ],
      connection,
    });

    getSessionCategoryResult = getSessionCategoryResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      getSessionCategoryResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, UserId } = req.body;

    let deleteSessionResult = await executeSp({
      spName: "SessionDelete",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });

    deleteSessionResult = deleteSessionResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      deleteSessionResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sessionsByInstituteGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      InstituteId,
      InstituteBranchId,
      NurseId,
      FromDate,
      ToDate,
      Page,
      PageSize,
    } = req.body;

    let sessionsByInstituteResult = await executeSp({
      spName: "SessionsByInstituteGet",
      params: [
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: InstituteId,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
        {
          name: "NurseId",
          type: sql.TYPES.Int,
          value: NurseId,
        },
        {
          name: "FromDate",
          type: sql.TYPES.NVarChar(20),
          value: FromDate,
        },
        {
          name: "ToDate",
          type: sql.TYPES.NVarChar(20),
          value: ToDate,
        },
        {
          name: "Page",
          type: sql.TYPES.Int,
          value: Page,
        },
        {
          name: "PageSize",
          type: sql.TYPES.Int,
          value: PageSize,
        },
      ],
      connection,
    });

    const totalRows = sessionsByInstituteResult?.recordsets[1][0]?.TotalRows;
    sessionsByInstituteResult = sessionsByInstituteResult?.recordsets[0];

    sessionsByInstituteResult.forEach((data) => {
      if (data.Sessions) {
        data.Sessions = JSON.parse(data.Sessions);
      } else {
        data.Sessions = [];
      }
    });

    handleResponse(res, 200, "success", "Operation Success", {
      doctors: sessionsByInstituteResult,
      totalRows,
      pages: Math.ceil(totalRows / PageSize),
    });
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sessionsByDoctorGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { DoctorId, InstituteBranchId, Id, UserId, SelectedDate, NurseId } =
      req.body;

    let sessionsByDoctorResult = await executeSp({
      spName: "SessionsDoctorByGetV2",
      params: [
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },

        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
        {
          name: "SelectedDate",
          type: sql.TYPES.NVarChar(20),
          value: SelectedDate,
        },
        {
          name: "NurseId",
          type: sql.TYPES.Int,
          value: NurseId,
        },
      ],
      connection,
    });

    sessionsByDoctorResult = sessionsByDoctorResult?.recordsets[0];

    if (
      Array.isArray(sessionsByDoctorResult) &&
      sessionsByDoctorResult.length > 0
    ) {
      sessionsByDoctorResult.forEach((session) => {
        if (session.SmsConfigs) {
          session.SmsConfigs = JSON.parse(session.SmsConfigs);
        } else {
          session.SmsConfigs = {};
        }
        if (session.SessionServices) {
          session.SessionServices = JSON.parse(session.SessionServices);
        } else {
          session.SessionServices = [];
        }
        if (session.TimeStart && session.TimeEnd) {
          session.TimeStart = session.TimeStart.toISOString().split(".")[0];
          session.TimeEnd = session.TimeEnd.toISOString().split(".")[0];
        }
      });
    }

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      sessionsByDoctorResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sessionsByInstituteBranchGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { InstituteBranchId } = req.body;

    let sessionsByDoctorResult = await executeSp({
      spName: "SessionsByInstituteBranch",
      params: [
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
      ],
      connection,
    });

    sessionsByDoctorResult = sessionsByDoctorResult?.recordsets[0];

    if (
      Array.isArray(sessionsByDoctorResult) &&
      sessionsByDoctorResult.length > 0
    ) {
      sessionsByDoctorResult.forEach((session) => {
        if (session.SmsConfigs) {
          session.SmsConfigs = JSON.parse(session.SmsConfigs);
        } else {
          session.SmsConfigs = {};
        }
        if (session.SessionServices) {
          session.SessionServices = JSON.parse(session.SessionServices);
        } else {
          session.SessionServices = [];
        }
        if (session.TimeStart && session.TimeEnd) {
          session.TimeStart = session.TimeStart.toISOString().split(".")[0];
          session.TimeEnd = session.TimeEnd.toISOString().split(".")[0];
        }
      });
    }

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      sessionsByDoctorResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sessionsToday = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { fromDate, instituteId } = request.body;

    const now = moment().utc();
    const expiryTime = now.tz("Asia/Colombo");
    const expiryTimeFormatted = expiryTime.format("YYYY-MM-DD HH:mm:ss");
    console.log(expiryTimeFormatted);

    const sessionQuery = `
    SELECT 
    Sessions.Id AS sessionId,
    Sessions.TimeStart AS timeStart,
    Sessions.TimeEnd AS timeEnd,
    Sessions.Category AS category,
    Sessions.SessionCategoryId AS sessionCategoryId,
    Sessions.RoomNumber AS roomNumber,
    Sessions.InstituteBranchId AS instituteBranchId,
    Sessions.AppointmentLimit AS appointmentLimit,
    Sessions.DoctorId AS doctor 
    FROM Sessions
    WHERE Sessions.TimeStart >= convert(date,'${fromDate}',23) AND Sessions.TimeEnd >= CAST('${expiryTimeFormatted}' AS datetime) AND Sessions.IsDeleted = 0 
    ORDER BY Sessions.TimeStart ASC;
    `;

    const doctorQuery = `SELECT 
    D.Id AS doctorId, 
    D.FirstName AS firstName, 
    D.MiddleName AS middleName, 
    D.LastName AS lastName,
    D.Email AS email,
    D.NIC AS nic,
    D.Status AS status, 
    D.RegistrationNumber AS registrationNumber, 
    D.Title AS title, 
    COALESCE(IBD.DoctorFee,0) as doctorFee,
    COALESCE(IBD.HospitalFee , 0) as hospitalFee,
    COALESCE(IBD.ServiceFee , 0) as serviceFee,
    COALESCE(IBD.OtherFee , 0) as otherFee,
    D.Specialization AS specialization
    FROM DoctorView D 
    LEFT OUTER JOIN InstituteBranchDoctors IBD on IBD.DoctorId = D.Id
    LEFT OUTER JOIN InstituteBranches IB on IB.Id = IBD.InstituteBranchId
    LEFT OUTER JOIN Institutes I on I.Id = IB.InstituteId where I.Id = ${instituteId} and IBD.IsDeleted = 0 AND D.IsDeleted = 0;`;

    let doctorsResult = await executeQuery({ query: doctorQuery, connection });
    let sessionResult = await executeQuery({ query: sessionQuery, connection });

    // connection.close();
    doctorsResult = doctorsResult.recordsets[0];

    sessionResult = sessionResult.recordsets[0];

    const sessionsOnToday = doctorsResult.map((doctor) => {
      const sessions = sessionResult.filter(
        (session) => session.doctor === doctor.doctorId
      );
      return {
        ...doctor,
        sessions: sessions,
      };
    });

    handleResponse(
      res,
      200,
      "success",
      "Sessions retrived successfully",
      sessionsOnToday
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const sessionsTodayV2 = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { fromDate, branchId } = request.body;

    const now = moment().utc();
    const expiryTime = now.tz("Asia/Colombo");
    const expiryTimeFormatted = expiryTime.format("YYYY-MM-DD HH:mm:ss");
    console.log(expiryTimeFormatted);

    const sessionQuery = `
    SELECT  
    Sessions.Id AS sessionId,
    Sessions.TimeStart AS timeStart,
    Sessions.TimeEnd AS timeEnd,
    Sessions.Category AS category,
    Sessions.SessionCategoryId AS sessionCategoryId,
    Sessions.RoomNumber AS roomNumber,
    Sessions.InstituteBranchId AS instituteBranchId,
    Sessions.AppointmentLimit AS appointmentLimit,
    Sessions.DoctorId AS doctor,
    sessionServices = (SELECT SS.ServiceId,SF.ServiceName, IBDS.DoctorFee,IBDS.HospitalFee, IBDS.ServiceFee FROM SessionServices SS LEFT JOIN InstituteBranchDoctorServiceFees IBDS ON IBDS.Id = SS.ServiceId 
                                LEFT JOIN ServiceFees SF ON IBDS.ServiceId = SF.Id
                                WHERE SS.SessionId = Sessions.Id FOR JSON PATH),
    COALESCE(MAX(Appointments.Number), 0) AS currentAppointments
    FROM Sessions
    LEFT JOIN [MedicaClinic].[dbo].[Appointments] Appointments ON Sessions.Id = Appointments.SessionId
    WHERE Sessions.TimeStart >= convert(date,'${fromDate}',23) AND Sessions.InstituteBranchId=${branchId}  AND Sessions.TimeEnd >= CAST('${expiryTimeFormatted}' AS datetime) AND Sessions.IsDeleted = 0 
    GROUP BY Sessions.Id, Sessions.TimeStart, Sessions.TimeEnd, Sessions.Category,Sessions.SessionCategoryId, Sessions.RoomNumber, Sessions.InstituteBranchId, Sessions.AppointmentLimit, Sessions.DoctorId
    HAVING COALESCE(MAX(Sessions.appointmentLimit),1000) > COALESCE(MAX(Appointments.Number), 0)
    ORDER BY Sessions.TimeStart ASC;
    `;

    const doctorQuery = `SELECT 
    D.Id AS doctorId, 
    D.FirstName AS firstName, 
    D.MiddleName AS middleName, 
    D.LastName AS lastName,
    D.Email AS email,
    D.NIC AS nic,
    D.Status AS status, 
    D.RegistrationNumber AS registrationNumber, 
    D.Title AS title, 
    COALESCE(IBD.DoctorFee,0) as doctorFee,
    COALESCE(IBD.HospitalFee , 0) as hospitalFee,
    COALESCE(IBD.ServiceFee , 0) as serviceFee,
    COALESCE(IBD.OtherFee , 0) as otherFee,
    D.Specialization AS specialization
    FROM DoctorView D 
    LEFT OUTER JOIN InstituteBranchDoctors IBD on IBD.DoctorId = D.Id
    LEFT OUTER JOIN InstituteBranches IB on IB.Id = IBD.InstituteBranchId
    LEFT OUTER JOIN Institutes I on I.Id = IB.InstituteId where IB.Id = ${branchId} and IBD.IsDeleted = 0 AND D.IsDeleted = 0;`;

    let doctorsResult = await executeQuery({ query: doctorQuery, connection });
    let sessionResult = await executeQuery({ query: sessionQuery, connection });

    // connection.close();
    doctorsResult = doctorsResult.recordsets[0];

    sessionResult = sessionResult.recordsets[0];

    if (Array.isArray(sessionResult) && sessionResult.length > 0) {
      sessionResult.forEach((data) => {
        if (data.sessionServices) {
          data.sessionServices = JSON.parse(data.sessionServices);
        } else {
          data.sessionServices = [];
        }
      });
    }

    const sessionsOnToday = doctorsResult.map((doctor) => {
      const sessions = sessionResult.filter(
        (session) => session.doctor === doctor.doctorId
      );
      return {
        ...doctor,
        sessions: sessions,
      };
    });

    handleResponse(
      response,
      200,
      "success",
      "Sessions retrived successfully",
      sessionsOnToday
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const sessionsByInstitute = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { instituteId } = req.body;
    // console.log('request.body:', serviceName, userId, instituteId);

    if (
      instituteId === null ||
      instituteId === undefined ||
      instituteId === ""
    ) {
      throw new Error("Institute id is required");
    }

    const serviceFeeSaveResult = await executeSp({
      spName: "DoctorSessionGetByInstituteId",
      params: [
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: instituteId,
        },
      ],
      connection,
    });
    let data = serviceFeeSaveResult.recordsets[0];
    data.forEach((item) => {
      item.Doctors = JSON.parse(item.Doctors);
    });

    handleResponse(
      res,
      200,
      "success",
      "DoctorSessionGetByInstituteId successfully",
      data
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
