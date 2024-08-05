import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  DateString,
  StringValue,
  SignedInteger,
} from '../../../utils/type-def.js';
import sql from 'mssql';

const AdminController = {
  /**
   *
   * Get users
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getUsers(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Admin.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;

      const { SearchBy, FilterBy, Page = 0, Limit = 0 } = request.body;

      var params = [
        EntityId({ fieldName: 'UserId', value: request.user.userId }),
        { name: 'SearchBy', type: sql.NVarChar, value: SearchBy },
        // { name: 'FilterBy', type: sql.NVarChar, value: FilterBy },
        { name: 'Page', type: sql.Int, value: Page },
        { name: 'Limit', type: sql.Int, value: Limit },
      ];

      let usersGetResult = await executeSp({
        spName: `UsersGet`,
        params: params,
        connection,
      });

      usersGetResult = [
        usersGetResult.recordsets[0],
        usersGetResult.recordsets[1][0],
      ];
      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        usersGetResult
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

export default AdminController;
