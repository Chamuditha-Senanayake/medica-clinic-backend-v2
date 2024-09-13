import { validationResult } from "express-validator";
import ResponseMessage from "../../../config/messages.js";
import executeSp from "../../../utils/exeSp.js";
import handleError from "../../../utils/handleError.js";
import handleResponse from "../../../utils/handleResponse.js";
import { EntityId, StringValue } from "../../../utils/type-def.js";

const ProductController = {
  /**
   *
   * get product by type and id
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */

  async getProductByExtIdAndBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Product.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { ExtId, InstituteBranchId } = request.body;

      var params = [
        EntityId({ fieldName: "ExtId", value: ExtId }),
        EntityId({ fieldName: "InstituteBranchId", value: InstituteBranchId }),
      ];

      let ProductGetByIdAndType = await executeSp({
        spName: "V2_ProductGetByExtIdAndType",
        params: params,
        connection,
      });

      ProductGetByIdAndType = ProductGetByIdAndType.recordsets[0];
      handleResponse(
        response,
        200,
        "success",
        "Patient data retrieved successfully",
        ProductGetByIdAndType
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

export default ProductController;
