import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const searchInstitutes = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Name, Page, PageSize } = req.body;

    let searchInstituteResult = await executeSp({
      spName: "InstituteSearchByName",
      params: [
        {
          name: "Name",
          type: sql.TYPES.NVarChar(50),
          value: Name,
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
    const totalRows = searchInstituteResult?.recordsets[1][0]?.TotalRows;

    searchInstituteResult = searchInstituteResult?.recordsets[0];

    handleResponse(res, 200, "success", "Operation Success", {
      insitutes:searchInstituteResult,
      totalRows,
      pages: Math.ceil(totalRows / PageSize),
    });
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchSave = async (req, res, next) => {
  try {
    const {
      Id,
      InstituteId,
      Name,
      Email,
      Website,
      Address,
      Numbers,
      Status,
      UserSaved,
    } = req.body;

    let connection = req.app.locals.db;

    const contactNumberTable = new sql.Table();
    contactNumberTable.columns.add("Id", sql.Int);
    contactNumberTable.columns.add("Number", sql.VarChar(15));
    contactNumberTable.columns.add("Status", sql.TinyInt);

    // Add data to the table object
    Numbers.forEach((phoneNumber) => {
      contactNumberTable.rows.add(null, phoneNumber, 1);
    });

    const instituteBranchSaveResponse = await executeSp({
      spName: "InstituteBranchSaveV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: InstituteId,
        },
        {
          name: "Name",
          type: sql.TYPES.NVarChar(100),
          value: Name,
        },
        {
          name: "Email",
          type: sql.TYPES.NVarChar(100),
          value: Email,
        },
        {
          name: "Website",
          type: sql.TYPES.NVarChar(100),
          value: Website,
        },

        {
          name: "AddressId",
          type: sql.TYPES.Int,
          value: Address?.Id,
        },
        {
          name: "AddressLine1",
          type: sql.TYPES.NVarChar(75),
          value: Address?.AddressLine1,
        },
        {
          name: "AddressLine2",
          type: sql.TYPES.NVarChar(75),
          value: Address?.AddressLine2,
        },
        {
          name: "Suburb",
          type: sql.TYPES.NVarChar(75),
          value: Address?.Suburb,
        },
        {
          name: "City",
          type: sql.TYPES.NVarChar(75),
          value: Address?.City,
        },

        {
          name: "Postcode",
          type: sql.TYPES.NVarChar(75),
          value: Address?.Postcode,
        },
        {
          name: "Country",
          type: sql.TYPES.NVarChar(75),
          value: Address?.Country,
        },
        {
          name: "AddressStatus",
          type: sql.TYPES.Int,
          value: Address?.Status,
        },
        {
          name: "Province",
          type: sql.TYPES.NVarChar(75),
          value: Address?.Province,
        },
        {
          name: "ContactNumbers",
          type: sql.TVP("ContactNumbers"),
          value: contactNumberTable,
        },
        {
          name: "Status",
          type: sql.TYPES.Int,
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
    let instituteBranch = instituteBranchSaveResponse?.recordsets[0];
    instituteBranch.forEach((data) => {
      data.Address = JSON.parse(data.Address);
      data.ContactNumbers = JSON.parse(data.ContactNumbers);
    });
    handleResponse(response, 200, "sucess", "data retrived", instituteBranch[0]);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchNurseGet = async (req, res, next) => {
  try {
    const { Id, InstituteBranchId, NurseId, UserId } = req.body;
    // console.log(branchId, doctorId, fromDate, toDate, userId);
    let connection = req.app.locals.db;

    const branchNurseResult = await executeSp({
      spName: "NurseBranchGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
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
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });
    let branchNurses = branchNurseResult?.recordsets[0];

    handleResponse(response, 200, "sucess", "data retrived", branchNurses);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchDoctorAssignGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { userId, doctorId, instituteId } = req.body;
    // console.log('req.body:', userId, doctorId, instituteId);
    const InstituteBranchDoctorAssignsGetResult = await executeSp({
      spName: "InstituteBranchDoctorAssignsGet",
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
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: instituteId ? instituteId : null,
        },
      ],
      connection,
    });
    handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        InstituteBranchDoctorAssignsGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { UserId, Id } = req.body;
    // console.log('req.body:', userId, doctorId);
    const instituteGetResult = await executeSp({
      spName: "InstituteGetV2",
      params: [
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId ? UserId : null,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id ? Id : null,
        },
      ],
      connection,
    });

    handleResponse(
        response,
        200,
        "success",
        "Data retrived successfully",
        instituteGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      Name,
      Email,
      Website,
      StartDate,
      BusinessRegistration,
      InstituteContactNumber,
      HouseName,
      StreetName,
      AddressTown,
      Status,
      UserSaved,
      Id,
    } = req.body;
    // console.log('req.body:', userId, doctorId);
    const instituteSaveResult = await executeSp({
      spName: "InstituteSaveV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id ? Id : null,
        },
        {
          name: "Name",
          type: sql.TYPES.NVarChar(100),
          value: Name ? Name : null,
        },
        {
          name: "Email",
          type: sql.TYPES.NVarChar(100),
          value: Email ? Email : null,
        },
        {
          name: "Website",
          type: sql.TYPES.NVarChar(250),
          value: Website ? Website : null,
        },
        {
          name: "StartDate",
          type: sql.TYPES.Date,
          value: StartDate ? StartDate : null,
        },
        {
          name: "BusinessRegistration",
          type: sql.TYPES.NVarChar(50),
          value: BusinessRegistration ? BusinessRegistration : null,
        },
        {
          name: "InstituteContactNumber",
          type: sql.TYPES.NVarChar(50),
          value: InstituteContactNumber ? InstituteContactNumber : null,
        },
        {
          name: "HouseName",
          type: sql.TYPES.NVarChar(150),
          value: HouseName ? HouseName : null,
        },
        {
          name: "StreetName",
          type: sql.TYPES.NVarChar(150),
          value: StreetName ? StreetName : null,
        },
        {
          name: "AddressTown",
          type: sql.TYPES.NVarChar(150),
          value: AddressTown ? AddressTown : null,
        },
        {
          name: "Status",
          type: sql.TYPES.TinyInt,
          value: Status ? Status : null,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved ? UserSaved : null,
        },
      ],
      connection,
    });

    handleResponse(
        response,
        200,
        "success",
        "Institute saved successfully",
        instituteSaveResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteAllDoctors = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, InstituteBranchId, UserId } = req.body;
    // console.log('req.body:', userId, doctorId);
    const instituteBranchDoctorGetResult = await executeSp({
      spName: "InstituteBranchDoctorGetV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id ? Id : null,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId ? InstituteBranchId : null,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId ? UserId : null,
        },
      ],
      connection,
    });

    handleResponse(
        response,
        200,
        "success",
        "Institute doctors retrived successfully",
        instituteBranchDoctorGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchDoctorSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      id,
      branchId,
      doctorId,
      userSaved,
      doctorFee,
      hospitalFee,
      serviceFee,
      otherFee,
    } = req.body;
    // console.log('req.body:', id, branchId, doctorId, userSaved, doctorFee, hospitalFee, serviceFee, otherFee);
    const InstituteBranchDoctorSaveResult = await executeSp({
      spName: "InstituteBranchDoctorSaveV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: id ?? null,
        },
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: branchId ?? null,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId ?? null,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: userSaved ?? null,
        },
        {
          name: "DoctorFee",
          type: sql.TYPES.Float,
          value: doctorFee ?? null,
        },
        {
          name: "HospitalFee",
          type: sql.TYPES.Float,
          value: hospitalFee ?? null,
        },
        {
          name: "ServiceFee",
          type: sql.TYPES.Float,
          value: serviceFee ?? null,
        },
        {
          name: "OtherFee",
          type: sql.TYPES.Float,
          value: otherFee ?? null,
        },
      ],
      connection,
    });

    let responseMessage = "";
    if (id === null) {
      responseMessage = "Institute branch doctor saved successfully";
    } else {
      responseMessage = "Institute branch doctor updated successfully";
    }

    handleResponse(
        response,
        200,
        "success",
        responseMessage,
        InstituteBranchDoctorSaveResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchDoctorGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { branchId, doctorId, userId } = req.body;
    // console.log('req.body:', branchId, doctorId, userId);
    const doctorBranchGetResult = await executeSp({
      spName: "InstituteBranchDoctorGetV3",
      params: [
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: branchId,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: doctorId,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId,
        },
      ],
      connection,
    });

    let response = {
      Institute: {},
      Branch: {},
      InstituteBranchDoctor: {},
    };

    if (doctorBranchGetResult.recordset.length !== 0) {
      response = {
        Institute: JSON.parse(doctorBranchGetResult.recordset[0].Institute),
        Branch: JSON.parse(doctorBranchGetResult.recordset[0].Branch),
        InstituteBranchDoctor: JSON.parse(
            doctorBranchGetResult.recordset[0].InstituteBranchDoctor
        ),
      };
    }

    handleResponse(
        response,
        200,
        "success",
        "Institute branch doctor retrieved successfully",
        response
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchWardGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { UserId, InstituteBranchId, Number, Id } = req.body;
    // console.log('req.body:', branchId, doctorId, userId);
    const instituteBranchWardGetResult = await executeSp({
      spName: "Inward.InstituteBranchWardGetV2",
      params: [
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
        {
          name: "Number",
          type: sql.TYPES.Int,
          value: Number,
        },
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
      ],
      connection,
    });

    handleResponse(
        response,
        200,
        "success",
        "Institute branch doctor retrieved successfully",
        instituteBranchWardGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteBranchGet = async (req, res, next) => {
  try {
    const { Id, UserId } = req.body;

    let connection = req.app.locals.db;
    let instituteAndBranchesGetResult = await executeSp({
      spName: "InstitutesAndBranchGet",
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
    instituteAndBranchesGetResult =
        instituteAndBranchesGetResult?.recordsets[0];

    instituteAndBranchesGetResult.forEach((element) => {
      if (element?.Branches) {
        element.Branches = JSON.parse(element.Branches);
      } else {
        element.Branches = [];
      }
    });

    handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        instituteAndBranchesGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
export const instituteOrderedBranchGet = async (req, res, next) => {
  try {
    const { Id, DoctorId, InstituteId, UserId } = req.body;

    let connection = req.app.locals.db;

    let orderedBranchGetResult = await executeSp({
      spName: "InstituteOrderedBranchGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "DoctorId",
          type: sql.TYPES.Int,
          value: DoctorId,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: InstituteId,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });

    console.log(orderedBranchGetResult);
    orderedBranchGetResult = orderedBranchGetResult?.recordsets[0];
    if (
        Array.isArray(orderedBranchGetResult) &&
        orderedBranchGetResult.length > 0
    ) {
      orderedBranchGetResult.forEach((orderedBranchResult) => {
        if (orderedBranchResult.ContactNumbers) {
          orderedBranchResult.ContactNumbers = JSON.parse(
              orderedBranchResult.ContactNumbers
          );
        } else {
          orderedBranchResult.ContactNumbers = [];
        }

        if (orderedBranchResult.Addresses) {
          orderedBranchResult.Addresses = JSON.parse(
              orderedBranchResult.Addresses
          );
        } else {
          orderedBranchResult.Addresses = [];
        }
      });
    }

    handleResponse(
        response,
        200,
        "sucess",
        "Operation Success",
        orderedBranchGetResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
