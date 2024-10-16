import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";

export const resetPassword = async (req, res, next) => {
  try {
    const { EmployeeId, OldPassword, NewPassword, AuthorizedUserId } = req.body;

    let connection = req.app.locals.db;

    let resetPasswordResult = await executeSp({
      spName: "ResetEmployeePassword",
      params: [
        {
          name: "EmployeeId",
          type: sql.TYPES.Int,
          value: EmployeeId,
        },
        {
          name: "OldPassword",
          type: sql.TYPES.NVarChar(50),
          value: OldPassword,
        },
        {
          name: "NewPassword",
          type: sql.TYPES.NVarChar(50),
          value: NewPassword,
        },
        {
          name: "AuthorizedUserId",
          type: sql.TYPES.Int,
          value: AuthorizedUserId,
        },
      ],
      connection,
    });
    resetPasswordResult = resetPasswordResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Operation Success",
      resetPasswordResult
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { InstituteId, BranchId, UserStatus, TypeId } = req.body;

    const employeeListGetResult = await executeSp({
      spName: "GetEmployeeAndNurseList",
      params: [
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
          name: "UserStatus",
          type: sql.TYPES.Int,
          value: UserStatus,
        },
        {
          name: "TypeId",
          type: sql.TYPES.Int,
          value: TypeId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Employee and nurse list retrived successfully",
      employeeListGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const saveEmployee = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      Id,
      Title,
      FirstName,
      MiddleName,
      LastName,
      UserType,
      Email,
      NIC,
      Status,
      UserSaved,
      ContactNumbers,
      DateOfBirth,
      BranchId,
      UserName,
      Password,
      InstituteId,
      GroupPresentationName,
    } = req.body;
    // console.log('request.body:', userId, userTypeId);

    const contactNumberTable = new sql.Table();
    contactNumberTable.columns.add("Id", sql.Int);
    contactNumberTable.columns.add("Number", sql.VarChar(15));
    contactNumberTable.columns.add("Status", sql.TinyInt);

    // Add data to the table object
    ContactNumbers.forEach((phoneNumber) => {
      contactNumberTable.rows.add(
        phoneNumber.Id,
        phoneNumber.Number,
        phoneNumber.Status
      );
    });

    const employeeSaveResult = await executeSp({
      spName: "EmployeeSaveNew",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "Title",
          type: sql.TYPES.NVarChar(10),
          value: Title,
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
          name: "UserType",
          type: sql.TYPES.Int,
          value: UserType,
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
          name: "DateOfBirth",
          type: sql.TYPES.DateTime,
          value: DateOfBirth,
        },
        {
          name: "BranchId",
          type: sql.TYPES.Int,
          value: BranchId,
        },
        {
          name: "UserName",
          type: sql.TYPES.NVarChar(50),
          value: UserName,
        },
        {
          name: "Password",
          type: sql.TYPES.NVarChar(100),
          value: Password,
        },
        {
          name: "InstituteId",
          type: sql.TYPES.Int,
          value: InstituteId,
        },
        {
          name: "GroupPresentationName",
          type: sql.TYPES.NVarChar(50),
          value: GroupPresentationName,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Employee saved successfully",
      employeeSaveResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const getAllEmployee = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { InstituteId, BranchId, UserStatus, TypeId } = req.body;

    const employeeListGetResult = await executeSp({
      spName: "GetEmployeeList",
      params: [
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
          name: "UserStatus",
          type: sql.TYPES.Int,
          value: UserStatus,
        },
        {
          name: "TypeId",
          type: sql.TYPES.Int,
          value: TypeId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Employee list retrived successfully",
      employeeListGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { EmpId, ActionUserId, UserId, UserGroupId } = req.body;

    const employeeDeleteResult = await executeSp({
      spName: "DeleteEmployeeNew",
      params: [
        {
          name: "EmpId",
          type: sql.TYPES.Int,
          value: EmpId,
        },
        {
          name: "ActionUserId",
          type: sql.TYPES.Int,
          value: ActionUserId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Employee deleted successfully",
      employeeDeleteResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { employeeId, userId } = req.body;
    // console.log('request.body:', employeeId, userId);
    const employeeGetResult = await executeSp({
      spName: "EmployeeGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: employeeId,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Employee retrieved successfully",
      employeeGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const getInstituteBranchEmployee = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { employeeId, userId } = req.body;
    // console.log('request.body:', employeeId, userId);
    const employeeBranchGetResult = await executeSp({
      spName: "EmployeeInstituteBranchGetV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: employeeId,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Institute branch retrieved successfully",
      employeeBranchGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};

export const getUserEmployee = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { id, userId } = req.body;
    // console.log('req.body:', id, userId);
    const userEmployeeGetResult = await executeSp({
      spName: "UserEmployeeGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: id,
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: userId,
        },
      ],
      connection,
    });

    handleResponse(
      res,
      200,
      "success",
      "Institute branch retrieved successfully",
      userEmployeeGetResult.recordset
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
    next(error);
  }
};
