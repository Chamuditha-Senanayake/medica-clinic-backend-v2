import handleError from "./utils/handle-error.js";
import handleResponse from "./utils/handle-response.js";
import { EntityId, SignedInteger, StringValue, UnsignedInteger, } from "./utils/type-def.js";
const { Nurse: ResponseMessage } = require('../../../config/messages');
const { validationResult } = require("express-validator");

const NurseController = {
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
            const {
                Id,
                NurseUserId,
                UserId,

            } = req.body;

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

            console.log(nurseGetResult.recordsets);
            nurseGetResult = nurseGetResult.recordsets;

            //handle no data
            // if (nurseGetResult[0].length == 0) {
            //   handleResponse(res, 200, "success", "No data found", {});
            //   return;
            // }
            // const appointment = nurseGetResult[0][0];
            // const billData = nurseGetResult[1];

            // const data = {
            //   ...appointment,
            //   BillData: billData,
            // };

            handleResponse(
                res,
                200,
                "success",
                "Bill data retrived successfully",
                nurseGetResult
            );
        } catch (error) {
            handleError(res, 500, "error", error.message, "Something went wrong");
            next(error);
        }
    },
}

module.exports = NurseController;