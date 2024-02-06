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

const NoteController = {
  /**
   *
   * get disease by [Id, UserId]
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getNote(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Note.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, PatientId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "PatientId", value: PatientId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let noteGetResult = await executeSp({
        spName: `NoteGet`,
        params: params,
        connection,
      });

      noteGetResult = noteGetResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Notes retrived successfully",
        noteGetResult
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
   * save a disease
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveNote(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Note.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        PatientId,
        Note,
        AgeYears,
        AgeMonths,
        Status,
        UserSaved
      } = request.body;

    var params = [
      EntityId({ fieldName: "Id", value: Id }),
      EntityId({ fieldName: "PatientId", value: PatientId }),
      StringValue({ fieldName: "Note", value: Note }),
      EntityId({ fieldName: "AgeYears", value: AgeYears }),
      EntityId({ fieldName: "AgeMonths", value: AgeMonths }),
      EntityId({ fieldName: "Status", value: Status }),
      EntityId({ fieldName: "UserSaved", value: UserSaved }),

    ];

      let noteSaveResult = await executeSp({
        spName: `NoteSave`,
        params: params,
        connection,
      });

      console.log(noteSaveResult.recordsets);
      noteSaveResult = noteSaveResult.recordsets;

      handleResponse(
        response,
        200,
        "success",
        "Note retrieved successfully",
        noteSaveResult
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

export default NoteController;
