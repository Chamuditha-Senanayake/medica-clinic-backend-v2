const { validationResult } = require("express-validator");
const { Doctor: ResponseMessage } = require("../../../config/messages");

const DoctorController = {
  async index(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = req.app.locals.db;
      const { Id, DoctorUserId, UserId } = req.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "DoctorUserId", value: DoctorUserId }),
        EntityId({ fieldName: "UserId", value: UserId }),
      ];

      let doctorGetResult = await executeSp({
        spName: `DoctorGet`,
        params: params,
        connection,
      });

      console.log(doctorGetResult.recordsets);
      doctorGetResult = doctorGetResult.recordsets;

      //handle no data
      // if (doctorGetResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorGetResult[0][0];
      // const billData = doctorGetResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        res,
        200,
        "success",
        "Bill data retrived successfully",
        doctorGetResult
      );
    } catch (error) {
      handleError(res, 500, "error", error.message, "Something went wrong");
      next(error);
    }
  },

  async saveDoctor(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = req.app.locals.db;
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
        Chargers,
      } = req.body;

      var params = [
        EntityId({ fieldName: "Id", value: Id }),
        StringValue({ fieldName: "FirstName", value: FirstName }),
        StringValue({ fieldName: "MiddleName", value: MiddleName }),
        StringValue({ fieldName: "LastName", value: LastName }),
        StringValue({ fieldName: "Email", value: Email }),
        StringValue({ fieldName: "NIC", value: NIC }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        StringValue({ fieldName: "ContactNumbers", value: ContactNumbers }),
        StringValue({
          fieldName: "RegistrationNumber",
          value: RegistrationNumber,
        }),
        DateString({ fieldName: "DateOfBirth", value: DateOfBirth }),
        StringValue({ fieldName: "Title", value: Title }),
        StringValue({ fieldName: "ZoomEmail", value: ZoomEmail }),
        StringValue({ fieldName: "ZoomPassword", value: ZoomPassword }),
        StringValue({ fieldName: "Chargers", value: Chargers }),
      ];

      let doctorSaveResult = await executeSp({
        spName: `DoctorSave`,
        params: params,
        connection,
      });

      console.log(doctorSaveResult.recordsets);
      doctorSaveResult = doctorSaveResult.recordsets;

      //handle no data
      // if (doctorSaveResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorSaveResult[0][0];
      // const billData = doctorSaveResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        res,
        200,
        "success",
        "Bill data retrieved successfully",
        doctorSaveResult
      );
    } catch (error) {
      handleError(res, 500, "error", error.message, "Something went wrong");
      next(error);
    }
  },

  async getDoctorSpecializations(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = req.app.locals.db;
      const { DoctorId, Id } = req.body;

      var params = [
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "Id", value: Id }),
        EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
        StringValue({
          fieldName: "AppointmentNumber",
          value: AppointmentNumber,
        }),
      ];

      let doctorSpecializationsGetResult = await executeSp({
        spName: `DoctorSpecializationsGet`,
        params: params,
        connection,
      });

      console.log(doctorSpecializationsGetResult.recordsets);
      doctorSpecializationsGetResult =
        doctorSpecializationsGetResult.recordsets;

      //handle no data
      // if (doctorSpecializationsGetResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorSpecializationsGetResult[0][0];
      // const billData = doctorSpecializationsGetResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        res,
        200,
        "success",
        "Bill data retrived successfully",
        doctorSpecializationsGetResult
      );
    } catch (error) {
      handleError(res, 500, "error", error.message, "Something went wrong");
      next(error);
    }
  },

  async saveDoctorSpecialization(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = req.app.locals.db;
      const { DoctorId, SpecializationId, Status, UserSaved, Id } = req.body;

      var params = [
        EntityId({ fieldName: "DoctorId", value: DoctorId }),
        EntityId({ fieldName: "SpecializationId", value: SpecializationId }),
        SignedInteger({
          fieldName: "Status",
          value: Status,
        }),
        EntityId({ fieldName: "UserSaved", value: UserSaved }),
        EntityId({ fieldName: "Id", value: Id }),
      ];

      let doctorSpecializationsSaveResult = await executeSp({
        spName: `DoctorSpecializationsSave`,
        params: params,
        connection,
      });

      console.log(doctorSpecializationsSaveResult.recordsets);
      doctorSpecializationsSaveResult =
        doctorSpecializationsSaveResult.recordsets;

      //handle no data
      // if (doctorSpecializationsSaveResult[0].length == 0) {
      //   handleResponse(res, 200, "success", "No data found", {});
      //   return;
      // }
      // const appointment = doctorSpecializationsSaveResult[0][0];
      // const billData = doctorSpecializationsSaveResult[1];

      // const data = {
      //   ...appointment,
      //   BillData: billData,
      // };

      handleResponse(
        res,
        200,
        "success",
        "Bill data retrived successfully",
        doctorSpecializationsSaveResult
      );
    } catch (error) {
      handleError(res, 500, "error", error.message, "Something went wrong");
      next(error);
    }
  },
};

module.exports = DoctorController;
