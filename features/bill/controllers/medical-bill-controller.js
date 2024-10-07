import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import sql from "mssql";
import { deHashPatientId } from "../../../utils/id-hashing.js";
import Validation from "../../../utils/validation.js";
import executeQuery from "../../../db/executeQuery.js";

export const saveMedicalBill = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      Id,
      AppointmentId,
      PatientId,
      HomeAddress,
      OfficeAddress,
      ChargesForDrugs,
      ChargesForDoctor,
      ChargesForInvestigations,
      ChargesForOther,
      IssuingDate,
      Status,
      UserSaved,
    } = req.body;

    const medicalBillSaveResults = await executeSp({
      spName: "MedicalBillSaveV2",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "AppointmentId",
          type: sql.TYPES.Int,
          value: AppointmentId,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "HomeAddress",
          type: sql.TYPES.NVarChar(500),
          value: HomeAddress,
        },
        {
          name: "OfficeAddress",
          type: sql.TYPES.NVarChar(500),
          value: OfficeAddress,
        },
        {
          name: "ChargesForDrugs",
          type: sql.TYPES.Decimal(18, 2),
          value: ChargesForDrugs,
        },
        {
          name: "ChargesForDoctor",
          type: sql.TYPES.Decimal(18, 2),
          value: ChargesForDoctor,
        },
        {
          name: "ChargesForInvestigations",
          type: sql.TYPES.Decimal(18, 2),
          value: ChargesForInvestigations,
        },
        {
          name: "ChargesForOther",
          type: sql.TYPES.Decimal(18, 2),
          value: ChargesForOther,
        },
        {
          name: "IssuingDate",
          type: sql.TYPES.Date,
          value: IssuingDate,
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

    let medicalBill = Array.isArray(medicalBillSaveResults?.recordsets[0])
      ? medicalBillSaveResults?.recordsets[0][0]
      : medicalBillSaveResults?.recordsets[0];

    handleResponse(res, 200, "success", "Medical Bill Saved", medicalBill);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};

export const getMedicalBill = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, PatientId, UserId } = req.body;

    const medicalBillGetResults = await executeSp({
      spName: "MedicalBillGet",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "PatientId",
          type: sql.TYPES.Int,
          value: deHashPatientId({
            patientId: PatientId,
          }),
        },
        {
          name: "UserId",
          type: sql.TYPES.Int,
          value: UserId,
        },
      ],
      connection,
    });
    let medicalBills = medicalBillGetResults?.recordsets[0];

    handleResponse(res, 200, "success", "Medical Bill Retrieved", medicalBills);
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const billDataSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    // console.log('req.body:', req.body);
    let billDataSaveResult = {};
    let itemsCount = 0;
    let successfulInsertsCount = 0;

    for (const item of req.body) {
      itemsCount++;
      const {
        itemName,
        billId,
        hospitalFee,
        doctorFee,
        serviceFee,
        otherFee,
        totalFee,
      } = item;

      try {
        const billSaveQuery = `INSERT INTO BillDataSet
               (ItemName
               ,BillId
               ,HospitalFee
               ,DoctorFee
               ,ServiceFee
               ,OtherFee
               ,TotalFee)
         VALUES
               ('${itemName}'
               ,${billId}
               ,${hospitalFee}
               ,${doctorFee}
               ,${serviceFee ?? 0}
               ,${otherFee ?? 0}
               ,${totalFee})`;
        billDataSaveResult = await executeQuery({
          query: billSaveQuery,
          connection,
        });
        // console.log('req.body.itemArray.item.billSaveResult:', billSaveResult);
        if (billDataSaveResult.rowsAffected) {
          // console.log('req.body.itemArray.item.billSaveResult.rowsAffected:', billSaveResult.rowsAffected[0]);
          successfulInsertsCount++;
        }
      } catch (errorInner) {
        console.log(errorInner);
      }
    }

    const responseRecreated = {
      recordsets: [],
      recordset: undefined,
      output: {},
      rowsAffected: [successfulInsertsCount],
    };

    if (successfulInsertsCount === itemsCount) {
      handleResponse(res, 200, "success", "Bill data added", responseRecreated);
    } else {
      handleError(res, 500, "error", "Something went wrong", responseRecreated);
    }
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const billDataGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const billGetQuery = `SELECT 
      *
      FROM Bill
      WHERE Id = ${req.params.billId}`;
    const billGetResult = await executeQuery({
      query: billGetQuery,
      connection,
    });

    const billDataGetQuery = `SELECT 
      ItemName
      ,BillId
      ,Id
      ,HospitalFee
      ,DoctorFee
      ,ServiceFee
      ,OtherFee
      ,TotalFee
      ,Amount
      FROM BillDataSet
      WHERE BillId = ${req.params.billId}`;
    const billDataGetResult = await executeQuery({
      query: billDataGetQuery,
      connection,
    });

    if (billGetResult.rowsAffected[0] === 0) {
      throw new Error("Invalid bill id! Retry with a valid bill id.");
    } else {
      handleResponse(res, 200, "success", "Bill retrieved successfully", {
        bill: billGetResult.recordset[0],
        billData: billDataGetResult.recordset,
      });
    }
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const billGet = async (req, res, next) => {
  try {
    const { appointmentId } = req.query;
    Validation.entityId({ name: "Id", value: parseInt(appointmentId) });
    let connection = req.app.locals.db;
    const billGetAllQuery = `SELECT 
    *,
    (SELECT * FROM BillRemarks WHERE BillId = B.Id FOR JSON PATH) AS BillReamrks
    FROM Bill B
    WHERE AppointmentId = ${appointmentId}`;
    const billGetAllResult = await executeQuery({
      query: billGetAllQuery,
      connection,
    });

    let billDataGetResult = {};
    const responseRecreated = [];
    for (let i = 0; i < billGetAllResult.recordset.length; i++) {
      if (billGetAllResult.recordset[i]?.BillReamrks) {
        billGetAllResult.recordset[i].BillReamrks = JSON.parse(
          billGetAllResult.recordset[i].BillReamrks
        );
      }
      const billDataGetQuery = `SELECT
        ItemName
        ,BillId
        ,Id
        ,HospitalFee
        ,DoctorFee
        ,ServiceFee
        ,TotalFee
        ,Amount
        FROM BillDataSet
        WHERE BillId = ${billGetAllResult.recordset[i].Id}`;
      billDataGetResult = await executeQuery({
        query: billDataGetQuery,
        connection,
      });
      if (billDataGetResult.recordset.length > 0) {
        responseRecreated.push({
          bill: billGetAllResult.recordset[i],
          billData: billDataGetResult.recordset,
        });
      }
    }

    if (billGetAllResult.rowsAffected[0] === 0) {
      handleError(
        res,
        200,
        "error",
        "Invalid appointment id",
        billGetAllResult.recordset
      );
    } else {
      handleResponse(
        res,
        200,
        "success",
        "All bills retrieved successfully",
        responseRecreated
      );
    }
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const billUpdatePaymentStatus = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { billId, paymentStatus } = req.body;
    if (
      billId === null ||
      billId === undefined ||
      billId === "" ||
      isNaN(billId)
    ) {
      throw new Error("Please provide a valid bill id");
    }

    if (
      paymentStatus === null ||
      paymentStatus === undefined ||
      paymentStatus === "" ||
      paymentStatus.length > 50
    ) {
      throw new Error("Please provide a valid payment status");
    }

    const billPaymentStatusUpdateQuery = `  
    UPDATE Bill 
    SET PaymentStatus = '${paymentStatus}'
    WHERE Id = ${billId}`;

    const refundBillDataGetResult = await executeQuery({
      query: billPaymentStatusUpdateQuery,
      connection,
    });

    handleResponse(res, 200, "success", "Payment Status Updated!", {});
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const billRemarkSave = async (req, res, next) => {
  try {
    const { Id, BillId, Type, Reason, Remark, UserSaved } = req.body;

    if (BillId === null || BillId === undefined || BillId === "") {
      throw new Error("Bill id is required");
    }

    if (Type === null || Type === undefined || Type === "") {
      throw new Error("Type is required");
    }

    if (Reason === null || Reason === undefined || Reason === "") {
      throw new Error("Reason is required");
    }

    if (Remark === null || Remark === undefined || Remark === "") {
      throw new Error("Remark is required");
    }

    if (UserSaved === null || UserSaved === undefined || UserSaved === "") {
      throw new Error("UserSaved is required");
    }

    let connection = req.app.locals.db;

    let billRemarkSaveResponse = await executeSp({
      spName: "BillRemarkSave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "BillId",
          type: sql.TYPES.Int,
          value: BillId,
        },
        {
          name: "Type",
          type: sql.TYPES.NVarChar(50),
          value: Type,
        },
        {
          name: "Reason",
          type: sql.TYPES.NVarChar(50),
          value: Reason,
        },
        {
          name: "Remark",
          type: sql.TYPES.NVarChar(200),
          value: Remark,
        },
        {
          name: "UserSaved",
          type: sql.TYPES.Int,
          value: UserSaved,
        },
      ],
      connection,
    });
    billRemarkSaveResponse = billRemarkSaveResponse?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "sucess",
      "Operation Success",
      billRemarkSaveResponse
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const billRemarkGet = async (req, res, next) => {
  try {
    const { Id, BillId, Type, Reason, Remark, UserSaved } = req.body;

    if (BillId === null || BillId === undefined || BillId === "") {
      throw new Error("Bill id is required");
    }

    if (Type === null || Type === undefined || Type === "") {
      throw new Error("Type is required");
    }

    let connection = req.app.locals.db;

    let billRemarkGetResponse = await executeSp({
      spName: "BillRemarkGet",
      params: [
        {
          name: "BillId",
          type: sql.TYPES.Int,
          value: BillId,
        },
        {
          name: "Type",
          type: sql.TYPES.NVarChar(50),
          value: Type,
        },
      ],
      connection,
    });
    billRemarkGetResponse = billRemarkGetResponse?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "sucess",
      "Operation Success",
      billRemarkGetResponse
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const refundBillDataSave = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    let refundSaveResult = {};
    let itemsCount = 0;
    let successfulInsertsCount = 0;

    for (const item of req.body) {
      itemsCount++;
      const {
        id,
        refundedHospitalFee,
        refundedDoctorFee,
        refundedTotalFee,
        userId,
      } = item;
      // console.log(id, refundedHospitalFee, refundedDoctorFee, refundedTotalFee, userId);
      try {
        const refundSaveQuery = `UPDATE BillDataSet
         SET RefundedHospitalFee = ${refundedHospitalFee}
         ,RefundedDoctorFee = ${refundedDoctorFee}
         ,RefundedTotalFee = ${refundedTotalFee}
         ,UserModified = ${userId}
         ,DateModified = Utils.dbo.GetCurrentDateTime()
         WHERE Id = ${id}`;
        refundSaveResult = await executeQuery({
          query: refundSaveQuery,
          connection,
        });
        if (refundSaveResult.rowsAffected) {
          successfulInsertsCount++;
        }
      } catch (errorInner) {
        console.log(errorInner);
      }
    }

    const responseRecreated = {
      recordsets: [],
      recordset: undefined,
      output: {},
      rowsAffected: [successfulInsertsCount],
    };

    if (successfulInsertsCount === itemsCount) {
      handleResponse(
        res,
        200,
        "success",
        "Refund data added",
        responseRecreated
      );
    } else {
      handleError(res, 500, "error", "Something went wrong", responseRecreated);
    }
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
export const refundBillDataGet = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const billGetQuery = `SELECT 
      *
      FROM Bill
      WHERE Id = ${req.params.billId}`;
    const refundBillGetResult = await executeQuery({
      query: billGetQuery,
      connection,
    });

    const billDataGetQuery = `SELECT 
      ItemName
      ,BillId
      ,Id
      ,HospitalFee
      ,DoctorFee
      ,ServiceFee
      ,OtherFee
      ,TotalFee
      ,Amount
      ,RefundedHospitalFee
      ,RefundedDoctorFee
      ,RefundedServiceFee
      ,RefundedOtherFee
      ,RefundedTotalFee
      FROM BillDataSet
      WHERE BillId = ${req.params.billId}`;
    const refundBillDataGetResult = await executeQuery({
      query: billDataGetQuery,
      connection,
    });

    if (refundBillGetResult.rowsAffected[0] === 0) {
      handleError(
        res,
        200,
        "error",
        "Invalid refund bill id",
        refundBillGetResult
      );
    } else {
      handleResponse(
        res,
        200,
        "success",
        "Refund bill data retrieved successfully",
        {
          refundBill: refundBillGetResult.recordset[0],
          refundBillData: refundBillDataGetResult.recordset,
        }
      );
    }
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Could not save medical bill", error);
  }
};
// export const serviceFeeSave = async (req, res, next) => {
//   try {
//     let connection = req.app.locals.db;
//     const { serviceFeeId, serviceName, userId, instituteId } = req.body;
//     // console.log('req.body:', serviceName, userId, instituteId);

//     if (
//         serviceName === null ||
//         serviceName === undefined ||
//         serviceName === ""
//     ) {
//       throw new Error("Service fee name is required");
//     }
//     if (userId === null || userId === undefined || userId === "") {
//       throw new Error("User id is required");
//     }
//     if (
//         instituteId === null ||
//         instituteId === undefined ||
//         instituteId === ""
//     ) {
//       throw new Error("Institute id is required");
//     }

//     const serviceFeeSaveResult = await executeSp({
//       spName: "ServiceFeeSave",
//       params: [
//         {
//           name: "ServiceName",
//           type: sql.TYPES.NVarChar,
//           value: serviceName,
//         },
//         {
//           name: "UserCreated",
//           type: sql.TYPES.Int,
//           value: userId,
//         },
//         {
//           name: "ServiceFeeId",
//           type: sql.TYPES.Int,
//           value: serviceFeeId,
//         },
//         {
//           name: "InstituteId",
//           type: sql.TYPES.Int,
//           value: instituteId,
//         },
//       ],
//       connection,
//     });

//     handleResponse(
//         res,
//         200,
//         "success",
//         "Service fee added successfully",
//         serviceFeeSaveResult
//     );
//   } catch (error) {
//     console.log(error);
//     handleError(res, 500, "error", "Could not save medical bill", error);
//   }
// };
