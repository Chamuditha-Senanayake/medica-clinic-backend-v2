import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";

export const setDoctorBio = async (req, res, next) => {
  try {
    const { InstituteBranchId, DoctorId, UserSaved, DoctorBio } = req.body;

    let connection = req.app.locals.db;

    let doctorBioSaveResult = await executeSp({
      spName: "DoctorBioSave",
      params: [
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
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "DoctorBio",
          type: sql.TYPES.NVarChar(4000),
          value: DoctorBio,
        },
      ],
      connection,
    });
    doctorBioSaveResult = doctorBioSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      doctorBioSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getDoctorBio = async (req, res, next) => {
  try {
    const { InstituteBranchId, DoctorId } = req.body;

    let connection = req.app.locals.db;

    let doctorBioSaveResult = await executeSp({
      spName: "DoctorBioGet",
      params: [
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
      ],
      connection,
    });
    doctorBioSaveResult = doctorBioSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      doctorBioSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const setShowDoctorForOnlineBookingStatus = async (req, res, next) => {
  try {
    const {
      InstituteBranchId,
      DoctorId,
      UserSaved,
      ShowDoctorForOnlineBooking,
    } = req.body;

    let connection = req.app.locals.db;

    let showDoctorForOnlineStatusSaveResult = await executeSp({
      spName: "ShowDoctorForOnlineBookingStatusSave",
      params: [
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
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
        {
          name: "ShowDoctorForOnlineBooking",
          type: sql.TYPES.Bit,
          value: ShowDoctorForOnlineBooking,
        },
      ],
      connection,
    });
    showDoctorForOnlineStatusSaveResult =
      showDoctorForOnlineStatusSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      showDoctorForOnlineStatusSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const assignSessionCategoryToDoctor = async (req, res, next) => {
  try {
    const { DoctorId, InstituteBranchId, SessionCategoryId, UserSaved } =
      req.body;

    let connection = req.app.locals.db;

    let assignSessionCategoryToDoctorResult = await executeSp({
      spName: "InstituteBranchDoctorSessionCategorySave",
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
          name: "SessionCategoryId",
          type: sql.TYPES.Int,
          value: SessionCategoryId,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    assignSessionCategoryToDoctorResult =
      assignSessionCategoryToDoctorResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      assignSessionCategoryToDoctorResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getDoctorSessionCategories = async (req, res, next) => {
  try {
    const { InstituteBranchId, DoctorId } = req.body;

    let connection = req.app.locals.db;

    let doctorSessionCategoryGetResult = await executeSp({
      spName: "InstituteBranchDoctorSessionCategoryGet",
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
    doctorSessionCategoryGetResult =
      doctorSessionCategoryGetResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      doctorSessionCategoryGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const saveOrUpdateDoctor = async (req, res, next) => {
  try {
    const {
      Id,
      FirstName,
      MiddleName,
      LastName,
      Email,
      NIC,
      Status,
      UserSaved,
      ContactNumbers,
      RegistrationNumber,
      DateOfBirth,
      Title,
      ZoomEmail,
      ZoomPassword,
      BranchId,
      DoctorFee,
      HospitalFee,
      ServiceFee,
      OtherFee,
      DoctorType,
    } = req.body;

    let connection = req.app.locals.db;

    const contactNumberTable = new sql.Table();
    contactNumberTable.columns.add("Id", sql.Int);
    contactNumberTable.columns.add("Number", sql.VarChar(15));
    contactNumberTable.columns.add("Status", sql.TinyInt);

    ContactNumbers.forEach((data) => {
      contactNumberTable.rows.add(data.Id, data.ContactNumber, data.Status);
    });

    let doctorSaveOrUpdateResult = await executeSp({
      spName: "DoctorSaveV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "FirstName",
          type: sql.TYPES.NVarChar(50),
          value: FirstName,
        },
        {
          name: "MiddleName",
          type: sql.TYPES.NVarChar(50),
          value: MiddleName,
        },
        {
          name: "LastName",
          type: sql.TYPES.NVarChar(50),
          value: LastName,
        },
        {
          name: "Email",
          type: sql.TYPES.NVarChar(100),
          value: Email,
        },
        {
          name: "NIC",
          type: sql.TYPES.NVarChar(20),
          value: NIC,
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
          name: "ContactNumbers",
          type: sql.TVP("ContactNumbers"),
          value: contactNumberTable,
        },
        {
          name: "RegistrationNumber",
          type: sql.TYPES.NVarChar(10),
          value: RegistrationNumber,
        },
        {
          name: "DateOfBirth",
          type: sql.TYPES.DateTime,
          value: DateOfBirth,
        },
        {
          name: "Title",
          type: sql.TYPES.NVarChar(10),
          value: Title,
        },
        {
          name: "ZoomEmail",
          type: sql.TYPES.NVarChar(50),
          value: ZoomEmail,
        },
        {
          name: "ZoomPassword",
          type: sql.TYPES.NVarChar(150),
          value: ZoomPassword,
        },
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: BranchId,
        },
        {
          name: "DoctorFee",
          type: sql.TYPES.Float,
          value: DoctorFee,
        },
        {
          name: "HospitalFee",
          type: sql.TYPES.Float,
          value: HospitalFee,
        },
        {
          name: "ServiceFee",
          type: sql.TYPES.Float,
          value: ServiceFee,
        },
        {
          name: "OtherFee",
          type: sql.TYPES.Float,
          value: OtherFee,
        },
        {
          name: "DoctorType",
          type: sql.TYPES.NVarChar(50),
          value: DoctorType,
        },
      ],
      connection,
    });
    doctorSaveOrUpdateResult = doctorSaveOrUpdateResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Doctor details updated",
      doctorSaveOrUpdateResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const saveDoctorSpecialization = async (req, res, next) => {
  try {
    const { DoctorId, Specializations, Status, UserSaved } = req.body;

    let connection = req.app.locals.db;

    if (!Array.isArray(Specializations)) {
      throw new Error("Specialization should be an array");
    }

    const specializationList = Specializations.join(",");

    let doctorSpecializationSaveResult = await executeSp({
      spName: "DoctorSpecializationsSaveV2",
      params: [
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "Specializations",
          type: sql.TYPES.NVarChar(sql.MAX),
          value: specializationList,
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
      ],
      connection,
    });
    doctorSpecializationSaveResult =
      doctorSpecializationSaveResult?.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      doctorSpecializationSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const getByUser = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { DoctorId, BranchId } = req.body;

    const doctorGetQuery = `
    SELECT D.Id, D.FirstName, D.MiddleName, D.LastName, D.Email, D.NIC, D.Status, D.RegistrationNumber, D.DateOfBirth, D.Title, IBD.DoctorFee, IBD.HospitalFee,IBD.ServiceFee, IBD.OtherFee
			FROM Doctors D
			LEFT OUTER JOIN InstituteBranchDoctors IBD ON D.Id = IBD.DoctorId 
			WHERE D.Id = ${DoctorId} AND D.IsDeleted = 0 AND IBD.InstituteBranchId = ${BranchId}`;

    let doctorsResult = await executeQuery({
      query: doctorGetQuery,
      connection,
    });

    doctorsResult = doctorsResult.recordsets[0];

    handleResponse(
      res,
      200,
      "success",
      "Doctors retrived successfully",
      doctorsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const getByBranch = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, BranchId, UserId } = req.body;

    let doctorsResult = await executeSp({
      spName: "DoctorGet",
      params: [
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: BranchId,
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
      ],
      connection,
    });

    doctorsResult = doctorsResult.recordsets[0];
    if (doctorsResult?.length > 0) {
      doctorsResult = doctorsResult[0];
      if (doctorsResult?.Specializations) {
        doctorsResult.Specializations = JSON.parse(
          doctorsResult.Specializations
        ).map((specialization) => specialization?.Name);
      } else {
        doctorsResult["Specializations"] = [];
      }
    } else {
      throw new Error("doctor not found");
    }
    handleResponse(
      res,
      200,
      "success",
      "Doctor retrived successfully",
      doctorsResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const doctorServiceFeeSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      serviceId,
      doctorId,
      instituteBranchId,
      doctorFee,
      hospitalFee,
      serviceFee,
      otherFee,
      userId,
      doctorServiceFeeId,
    } = req.body;
    // console.log('req.body:', serviceId, doctorId, instituteBranchId, doctorFee, hospitalFee, userId, doctorServiceFeeId);

    if (serviceId == null || serviceId == undefined || serviceId == "") {
      throw new Error("Service id is required");
    }
    if (doctorId == null || doctorId == undefined || doctorId == "") {
      throw new Error("Doctor id is required");
    }
    if (
      instituteBranchId == null ||
      instituteBranchId == undefined ||
      instituteBranchId == ""
    ) {
      throw new Error("Institute branch id is required");
    }
    // if (!doctorFee || doctorFee == "") {
    //   throw new Error("Doctor fee is required");
    // }
    // if (!hospitalFee || hospitalFee == "") {
    //   throw new Error("Hospital fee is required");
    // }
    if (userId == null || userId == undefined || userId == "") {
      throw new Error("User id is required");
    }

    const doctorServiceFeeSaveResult = await executeSp({
      spName: "InstituteBranchDoctorServiceFeeSave",
      params: [
        {
          name: "ServiceId",
          type: sql.TYPES.Int,
          value: serviceId,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: instituteBranchId,
        },
        {
          name: "DoctorFee",
          type: sql.TYPES.Float,
          value: doctorFee,
        },
        {
          name: "HospitalFee",
          type: sql.TYPES.Float,
          value: hospitalFee,
        },
        {
          name: "ServiceFee",
          type: sql.TYPES.Float,
          value: serviceFee,
        },
        {
          name: "OtherFee",
          type: sql.TYPES.Float,
          value: otherFee,
        },
        {
          name: "UserCreated",
          type: sql.TYPES.Int,
          value: userId,
        },
        {
          name: "DoctorServiceFeeId",
          type: sql.TYPES.Int,
          value: doctorServiceFeeId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Doctor service fee added successfully",
      doctorServiceFeeSaveResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const doctorServiceFeeGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { feeId, instituteBranchId, doctorId } = req.query;
    // console.log('req.query.params:', feeId, instituteBranchId, doctorId);
    const doctorServiceFeeGetResult = await executeSp({
      spName: "InstituteBranchDoctorServiceFeeGet",
      params: [
        {
          name: "DoctorServiceFeeId",
          type: sql.TYPES.Int,
          value: feeId ? feeId : null,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: instituteBranchId ? instituteBranchId : null,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId ? doctorId : null,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Doctor service fee retrieved successfully",
      doctorServiceFeeGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const notifyNewAppointment = async (req, res, next) => {
  try {
    const connection = req.app.locals.db;
    const { appointmentId } = req.body;
    // console.log(profileName, emailAddress, mobileNumber);
    if (
      appointmentId === null ||
      appointmentId === undefined ||
      appointmentId === ""
    ) {
      throw new Error("Profile name is required");
    }

    let DoctorNotifyDetailsGetResult = await executeSp({
      spName: "DoctorNotifyDetailsGet",
      params: [
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: appointmentId,
        },
      ],
      connection,
    });

    DoctorNotifyDetailsGetResult = DoctorNotifyDetailsGetResult?.recordset[0];

    const result = await sendEmail({
      to: "lasitheranga1@gmail.com",
      subject: "New Appointment Alert",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #ffffff;
                  margin: 0;
                  padding: 20px;
                  color: #333;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #f4f4f4;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
      
              h1 {
                  color: #0066cc;
                  text-align: center;
              }
      
              p {
                  color: #555;
              }
      
              strong {
                  color: #000;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Appointment Confirmation</h1>
              <p>Dear Dr. Lucifer Morningstar,</p>
              <p>A patient has just booked an appointment with you via our mobile app.</p>
              <p><strong>Details:</strong></p>
              <p><strong>Patient:</strong> Mr. Shiran SuriyaPathiraja</p>
              <p><strong>Date:</strong> 2024-01-03</p>
              <p><strong>Time:</strong> 03:00 PM - 04:00 PM</p>
              <p>Please confirm your availability at your earliest convenience.</p>
              <p>Thank you,</p>
              <p>Medica Healthcare System</p>
          </div>
      </body>
      </html>
      `,
    });
    handleResponse(res, 200, "success", "Doctor notified!", result);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const getDoctorByInstitute = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { userId, instituteId } = req.body;
    console.log("req.body:", userId, instituteId);
    const DoctorByInstituteGetResult = await executeSp({
      spName: "InstituteDoctorGet",
      params: [
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId ? userId : null,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: instituteId ? instituteId : null,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Data retrieved successfully",
      DoctorByInstituteGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const getDoctorInstitute = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { userId, doctorId } = req.body;
    // console.log('req.body:', userId, doctorId);
    const DoctorInstituteGetResult = await executeSp({
      spName: "DoctorInstituteGet",
      params: [
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId ? userId : null,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId ? doctorId : null,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Data retrieved successfully",
      DoctorInstituteGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
