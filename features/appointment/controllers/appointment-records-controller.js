import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";

export const getAppointmentRecords = async (req, res, next) => {
    try {
        const { branchId, startDate, endDate, userId } = req.body;
        let connection = req.app.locals.db;
        let getAppointmentRecordsResult = await executeSp({
            spName: "AppointmentRecordsGet",
            params: [
                {
                    name: "BranchId",
                    type: sql.TYPES.Int,
                    value: branchId ? branchId : null
                },
                {
                    name: "StartDate",
                    type: sql.TYPES.NVarChar(10),
                    value: startDate ? startDate : null
                },
                {
                    name: "EndDate",
                    type: sql.TYPES.NVarChar(10),
                    value: endDate ? endDate : null
                },
                {
                    name: "UserId",
                    type: sql.TYPES.Int,
                    value: userId ? userId : null
                }
            ],
            connection,
        });
        getAppointmentRecordsResult = getAppointmentRecordsResult?.recordset;
        handleResponse(res, 200, "success", "Operation Success", getAppointmentRecordsResult);
    } catch (error) {
        console.log(error);
        handleError(res, 500, "error", "Something went wrong", error);
    }
}
