import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
} from "../../../utils/type-def.js";
import sql from "mssql";

const NurseController = {
  /**
   *
   * get nurse by [Id, NurseUserId, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getNurse(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Nurse.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, NurseUserId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "NurseUserId", value: NurseUserId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let nurseGetResult = await executeSp({
        spName: `NurseGet`,
        params: params,
        connection,
      });

      nurseGetResult = nurseGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Nurse data retrived successfully",
        nurseGetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  /**
   *
   * save a nurse
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveNurse(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Nurse.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        FirstName,
        MiddleName,
        LastName,
        Email,
        NIC,
        Title,
        Status,
        UserSaved,
      } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "FirstName", value: FirstName }),
        StringValue({ fieldName: "MiddleName", value: MiddleName }),
        StringValue({ fieldName: "LastName", value: LastName }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "NIC", value: NIC }),
        StringValue({ fieldName: "Title", value: Title }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let nurseSaveResult = await executeSp({
        spName: `NurseSave`,
        params: params,
        connection,
      });

      console.log(nurseSaveResult.recordsets);
      nurseSaveResult = nurseSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Nurse data retrieved successfully",
        nurseSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  async SaveNurseBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Nurse.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, InstituteBranchId, NurseId, Status, UserSaved } =
        request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({
          fieldName: "InstituteBranchId",
          value: InstituteBranchId,
        }),
        StringValue({ fieldName: "NurseId", value: NurseId }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let nurseBranchSaveResult = await executeSp({
        spName: `NurseBranchSave`,
        params: params,
        connection,
      });

      console.log(nurseBranchSaveResult.recordsets);
      nurseBranchSaveResult = nurseBranchSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        nurseBranchSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },

  async SaveDoctorNurse(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Nurse.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, DoctorId, NurseId, Status, UserSaved } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "NurseId", value: NurseId }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
      ];

      let doctorNurseSaveResult = await executeSp({
        spName: `DoctorNurseSave`,
        params: params,
        connection,
      });

      console.log(doctorNurseSaveResult.recordsets);
      doctorNurseSaveResult = doctorNurseSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Data retrieved successfully",
        doctorNurseSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },
  async nurseInstituteBranchGet(request, response, next) {
    try {
      let connection = request.app.locals.db;
      const { nurseId, userId } = request.body;
      // console.log('request.body:', nurseId, userId);
      const nurseBranchGetResult = await executeSp({
        spName: "NurseBranchGetV2",
        params: [
          {
            name: "NurseId",
            type: sql.TYPES.Int,
            value: nurseId,
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
        response,
        200,
        "success",
        "Institute branch retrieved successfully",
        nurseBranchGetResult.recordset
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },
  async nurseDoctorGet(request, response, next) {
    try {
      const { Id, NurseId, DoctorId, UserId } = request.body;

      let connection = request.app.locals.db;

      let doctorNurseGetResult = await executeSp({
        spName: "DoctorNurseGetV2",
        params: [
          {
            name: "Id",
            type: sql.TYPES.Int,
            value: Id ? Id : null,
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
          {
            name: "DoctorId",
            type: sql.TYPES.Int,
            value: DoctorId,
          },
        ],
        connection,
      });
      doctorNurseGetResult = doctorNurseGetResult?.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        doctorNurseGetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },
  async nurseDoctorUpdate(request, response, next) {
    try {
      let connection = request.app.locals.db;
      const { Id, DoctorId, NurseId, Status, DeleteStatus, UserSaved } =
        request.body;
      // console.log('request.body:', branchId, doctorId, userId);
      const nurseDoctorUpdateResult = await executeSp({
        spName: "DoctorNurseUpdate",
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
            name: "NurseId",
            type: sql.TYPES.Int,
            value: NurseId,
          },
          {
            name: "Status",
            type: sql.TYPES.TinyInt,
            value: Status,
          },
          {
            name: "DeleteStatus",
            type: sql.TYPES.TinyInt,
            value: DeleteStatus,
          },
          {
            name: "UserSaved",
            type: sql.TYPES.Int,
            value: UserSaved,
          },
        ],
        connection,
      });

      handleResponse(
        response,
        200,
        "success",
        "Nurse doctor updated successfully",
        nurseDoctorUpdateResult.recordset[0]
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },
  async nurseGetAssignWards(request, response, next) {
    try {
      const { NurseId, InstituteBranchId, UserId } = request.body;

      let connection = request.app.locals.db;

      let assignedWardForNurseResult = await executeSp({
        spName: "Inward.NurseInstituteBranchWardGet",
        params: [
          {
            name: "NurseId",
            type: sql.TYPES.Int,
            value: NurseId,
          },
          {
            name: "InstituteBranchId",
            type: sql.TYPES.Int,
            value: InstituteBranchId,
          },
          {
            name: "UserId",
            type: sql.TYPES.Int,
            value: UserId,
          },
        ],
        connection,
      });
      assignedWardForNurseResult = assignedWardForNurseResult?.recordsets[0];

      handleResponse(
        response,
        200,
        "success",
        "Operation Success",
        assignedWardForNurseResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        "error",
        error.message,
        "Something went wrong"
      );
      next(error);
    }
  },
};

export default NurseController;
