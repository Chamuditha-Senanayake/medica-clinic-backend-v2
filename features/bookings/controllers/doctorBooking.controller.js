import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { EntityId, DateString } from "../../../utils/type-def.js";
import axios from "axios";

const DoctorBookingController = {
  /**
   *
   * get bookings by productid
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */

  async getSessionsByProductId(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Product.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      const { ProductId, SessionDate } = request.body;

      //   var params = [
      //     EntityId({ fieldName: "ProductId", value: ProductId }),
      //     DateString({ fieldName: "ProductId", value: ProductId }),
      //   ];

      const apiUrl = `${process.env.VITE_BOOKING_API}/session/${SessionDate}/existing`;
      const apiResponse = await axios.get(apiUrl);
      const sessionData = apiResponse.data;

      const matchingSessions = [];

      sessionData.forEach((data) => {
        const [_, productIdFromSession] = data.uniqueField.split("_");

        if (ProductId === parseInt(productIdFromSession, 10)) {
          matchingSessions.push(data);
        }
      });

      //   console.log("Matching Bookings:", matchingSessions);

      if (matchingSessions.length === 0) {
        return handleResponse(
          response,
          404,
          "error",
          "No matching bookings found",
          null
        );
      }

      handleResponse(
        response,
        200,
        "success",
        "Booking data retrieved successfully",
        matchingSessions
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

export default DoctorBookingController;
