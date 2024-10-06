import sql from "mssql";
import executeSp from "../../../db/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";

export const saveAppointmentRatings = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, AppoinmentId, Rating, Comment } = req.body;

    const appointmentRatingSaveResult = await executeSp({
      spName: "AppointmentRatingsSave",
      params: [
        {
          name: "Id",
          type: sql.TYPES.Int,
          value: Id,
        },
        {
          name: "AppoinmentId",
          type: sql.TYPES.Int,
          value: AppoinmentId,
        },
        {
          name: "Rating",
          type: sql.TYPES.Float,
          value: Rating,
        },
        {
          name: "Comment",
          type: sql.TYPES.NVarChar(1000),
          value: Comment,
        },
      ],
      connection,
    });

    let appointmentRating = appointmentRatingSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Appointment rating saved",
      appointmentRating
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getAppointmentRatings = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const {
      InstituteBranchId,
      AppoinmentId,
      Page = 1,
      PageSize = 10,
    } = req.body;

    const appointmentRatingGetResult = await executeSp({
      spName: "AppointmentRatingsGet",
      params: [
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
        },
        {
          name: "AppoinmentId",
          type: sql.TYPES.Int,
          value: AppoinmentId,
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

    const totalRows = appointmentRatingGetResult?.recordsets[1][0]?.TotalRows;

    let appointmentRatings = appointmentRatingGetResult?.recordsets[0];

    handleResponse(res, 200, "success", "Appointment rating retrieved", {
      appointmentRatings,
      totalRows,
      pages: Math.ceil(totalRows / PageSize),
    });
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const saveInstituteBranchRatings = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { Id, InstituteBranchId, Rating, Comment } = req.body;

    const instituteBranchRatingSaveResult = await executeSp({
      spName: "InstituteBranchRatingsSave",
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
          name: "Rating",
          type: sql.TYPES.Float,
          value: Rating,
        },
        {
          name: "Comment",
          type: sql.TYPES.NVarChar(1000),
          value: Comment,
        },
      ],
      connection,
    });

    let instituteBrnachRating =
      instituteBranchRatingSaveResult?.recordsets[0][0];

    handleResponse(
      res,
      200,
      "success",
      "Institute branch rating saved",
      instituteBrnachRating
    );
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};

export const getInstituteBranchRatings = async (req, res, next) => {
  try {
    let connection = req.app.locals.db;
    const { InstituteBranchId, Page = 1, PageSize = 10 } = req.body;

    const instituteBranchRatingGetResult = await executeSp({
      spName: "InstituteBranchRatingsGet",
      params: [
        {
          name: "InstituteBranchId",
          type: sql.TYPES.Int,
          value: InstituteBranchId,
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

    const totalRows = instituteBranchRatingGetResult?.recordsets[1][0]?.TotalRows;

    let instituteBranchRatings = instituteBranchRatingGetResult?.recordsets[0];

    handleResponse(res, 200, "success", "Institute branch ratings retrieved", {
      instituteBranchRatings,
      totalRows,
      pages: Math.ceil(totalRows / PageSize),
    });
  } catch (error) {
    console.log(error);
    handleError(res, 500, "error", "Something went wrong", error);
  }
};
