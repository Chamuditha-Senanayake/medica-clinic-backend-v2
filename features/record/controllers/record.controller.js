import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString
} from "../../../utils/type-def.js";

const RecordController = {
  /**
   *
   * get record
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getPatientRecords(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Record.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { UserId } = request.body;

      var params = [
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let RecordGetResult = await executeSp({
        spName: `PatientRecordsGet`,
        params: params,
        connection,
      });

      RecordGetResult = RecordGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Records retrived successfully",
        RecordGetResult
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
   * save a record
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async savePatientRecord(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Record.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        UserId,
        DoctorId,
        BodyPart,
        SubBodyPart,
        SubBodyPartType,
        Date,
        Diagnosis,
        Notes,
        Status = 1,
        UserSaved
      } = request.body;

    var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "UserId", value: UserId }),
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        StringValue({ fieldName: "BodyPart", value: BodyPart }),
        StringValue({ fieldName: "SubBodyPart", value: SubBodyPart }),       
        { fieldName: "SubBodyPartType", value: SubBodyPartType },
        DateString({ fieldName: "Date", value: Date }),
        StringValue({ fieldName: "Diagnosis", value: Diagnosis }),
        StringValue({ fieldName: "Notes", value: Notes }),
        SignedInteger({fieldName: "Status", value: Status}), 
        EntityId({ fieldName: "UserCreated", value: UserSaved }),
    ];


      let recordSaveResult = await executeSp({
        spName: `PatientRecordSave`,
        params: params,
        connection,
      });

      recordSaveResult = recordSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        "success",
        "Record retrieved successfully",
        recordSaveResult
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

export default RecordController;
