import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  StringValue,
  SignedInteger,
  DateString,
} from '../../../utils/type-def.js';

const DispositionController = {
  /**
   *
   * create disposition notification schedule
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async createDispositionNotificationSchedule(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        PatientId = 0,
        PrescriptionRecordId = 0,
        Disposition = '',
        UserSaved = 0,
        CurrentDate = '',
      } = request.body;

      var params = [
        EntityId({ fieldName: 'PatientId', value: PatientId }),
        EntityId({
          fieldName: 'PrescriptionRecordId',
          value: PrescriptionRecordId,
        }),
        StringValue({ fieldName: 'Disposition', value: Disposition }),
        EntityId({ fieldName: 'UserSaved', value: UserSaved }),
        DateString({ fieldName: 'CurrentDate', value: CurrentDate }),
      ];

      let DispositionNotificationScheduleCreate = await executeSp({
        spName: `DispositionNotificationScheduleCreate`,
        params: params,
        connection,
      });

      console.log(DispositionNotificationScheduleCreate.recordsets);
      DispositionNotificationScheduleCreate =
        DispositionNotificationScheduleCreate.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Disposition notification schedule successfully created',
        DispositionNotificationScheduleCreate
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  /**
   *
   * get disposition notification schedule
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   * @returns
   */
  async getDispositionNotificationSchedule(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        AppointmentId = 0,
        PatientId = 0,
        PrescriptionRecordId = 0,
        DateOfSending,
        Id = 0,
        UserId = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: 'AppointmentId', value: AppointmentId }),
        EntityId({ fieldName: 'PatientId', value: PatientId }),
        EntityId({
          fieldName: 'PrescriptionRecordId',
          value: PrescriptionRecordId,
        }),
        DateString({ fieldName: 'DateOfSending', value: DateOfSending }),
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'UserId', value: UserId }),
      ];

      let dispositionNotificationScheduleGet = await executeSp({
        spName: `DispositionNotificationScheduleGet`,
        params: params,
        connection,
      });

      dispositionNotificationScheduleGet =
        dispositionNotificationScheduleGet.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        dispositionNotificationScheduleGet
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  /**
   *
   * Get disposition notification schedule
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getDispositionNotificationScheduleLog(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        AppointmentId = 0,
        PatientId = 0,
        PrescriptionRecordId = 0,
        DispositionNotificationScheduleId = 0,
        DateOfSending,
        Id = 0,
        UserId,
      } = request.body;

      var params = [
        EntityId({ fieldName: 'AppointmentId', value: AppointmentId }),
        EntityId({ fieldName: 'PatientId', value: PatientId }),
        EntityId({
          fieldName: 'PrescriptionRecordId',
          value: PrescriptionRecordId,
        }),
        EntityId({
          fieldName: 'DispositionNotificationScheduleId',
          value: DispositionNotificationScheduleId,
        }),
        DateString({ fieldName: 'DateOfSending', value: DateOfSending }),
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'UserId', value: UserId }),
      ];

      let dispositionNotificationScheduleLogGetResult = await executeSp({
        spName: `DispositionNotificationScheduleLogGet`,
        params: params,
        connection,
      });

      dispositionNotificationScheduleLogGetResult =
        dispositionNotificationScheduleLogGetResult.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Disposition Notification Schedule log retrieved successfully',
        dispositionNotificationScheduleLogGetResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  /**
   *
   * Save disposition notification schedule
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async saveDispositionNotificationScheduleLog(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        AppointmentId = 0,
        PatientId = 0,
        PrescriptionRecordId = 0,
        DispositionNotificationScheduleId = 0,
        Disposition = '',
        PatientSMS = '',
        PatientEmail = '',
        PatientSMSData = '',
        PatientEmailData = '',
        PatientSMSStatus = 0,
        PatientEmailStatus = 0,
        DoctorSMS = '',
        DoctorEmail = '',
        DoctorSMSData = '',
        DoctorEmailData = '',
        DoctorSMSStatus = 0,
        DoctorEmailStatus = 0,
        DateOfSending,
        UserSaved = 0,
        Id = 0,
      } = request.body;

      var params = [
        EntityId({ fieldName: 'AppointmentId', value: AppointmentId }),
        EntityId({ fieldName: 'PatientId', value: PatientId }),
        EntityId({
          fieldName: 'PrescriptionRecordId',
          value: PrescriptionRecordId,
        }),
        EntityId({
          fieldName: 'DispositionNotificationScheduleId',
          value: DispositionNotificationScheduleId,
        }),
        StringValue({ fieldName: 'Disposition', value: Disposition }),
        StringValue({ fieldName: 'PatientSMS', value: PatientSMS }),
        StringValue({ fieldName: 'PatientEmail', value: PatientEmail }),
        StringValue({ fieldName: 'PatientSMSData', value: PatientSMSData }),
        StringValue({ fieldName: 'PatientEmailData', value: PatientEmailData }),
        SignedInteger({
          fieldName: 'PatientSMSStatus',
          value: PatientSMSStatus,
        }),
        SignedInteger({
          fieldName: 'PatientEmailStatus',
          value: PatientEmailStatus,
        }),
        StringValue({ fieldName: 'DoctorSMS', value: DoctorSMS }),
        StringValue({ fieldName: 'DoctorEmail', value: DoctorEmail }),
        StringValue({ fieldName: 'DoctorSMSData', value: DoctorSMSData }),
        StringValue({ fieldName: 'DoctorEmailData', value: DoctorEmailData }),
        SignedInteger({
          fieldName: 'DoctorSMSStatus',
          value: DoctorSMSStatus,
        }),
        SignedInteger({
          fieldName: 'DoctorEmailStatus',
          value: DoctorEmailStatus,
        }),
        DateString({ fieldName: 'DateOfSending', value: DateOfSending }),
        EntityId({
          fieldName: 'UserSaved',
          value: UserSaved,
        }),
        EntityId({
          fieldName: 'Id',
          value: Id,
        }),
      ];

      let dispositionNotificationScheduleLogSaveResult = await executeSp({
        spName: `DispositionNotificationScheduleLogSave`,
        params: params,
        connection,
      });

      dispositionNotificationScheduleLogSaveResult =
        dispositionNotificationScheduleLogSaveResult.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Disposition notification schedule log saved successfully',
        dispositionNotificationScheduleLogSaveResult
      );
    } catch (error) {
      console.log('errors', error);
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },

  /**
   *
   * Save Disposition Schedule
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async saveDispositionSchedule(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Doctor.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        PatientDispositionId = 0,
        ScheduledTime,
        ContactType = '',
        RecipientID = 0,
        ContactNumber = '',
        MessageMedium = '',
        Message = '',
        Status,
        UserSaved,
        Id = 0,
        UserId = 0,
      } = request.body;

      var params = [
        EntityId({
          fieldName: 'PatientDispositionId',
          value: PatientDispositionId,
        }),
        DateString({ fieldName: 'ScheduledTime', value: ScheduledTime }),
        StringValue({ fieldName: 'ContactType', value: ContactType }),
        EntityId({ fieldName: 'RecipientID', value: RecipientID }),
        StringValue({ fieldName: 'ContactNumber', value: ContactNumber }),
        StringValue({ fieldName: 'MessageMedium', value: MessageMedium }),
        StringValue({ fieldName: 'Message', value: Message }),
        EntityId({ fieldName: 'Status', value: Status }),
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'UserId', value: UserId }),
        EntityId({
          fieldName: 'UserSaved',
          value: UserSaved,
        }),
      ];

      let dispositionScheduleSaveResult = await executeSp({
        spName: `DispositionScheduleSave`,
        params: params,
        connection,
      });

      dispositionScheduleSaveResult = dispositionScheduleSaveResult.recordsets;
      handleResponse(
        response,
        200,
        'success',
        'Disposition schedule created successfully',
        dispositionScheduleSaveResult
      );
    } catch (error) {
      handleError(
        response,
        500,
        'error',
        error.message,
        'Something went wrong'
      );
      next(error);
    }
  },
};

export default DispositionController;
