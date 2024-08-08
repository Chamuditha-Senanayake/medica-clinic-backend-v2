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

      const params = [
        EntityId({ fieldName: 'UserId', value: request.user.userId }),
        { name: 'SearchBy', type: sql.NVarChar, value: SearchBy },
        { name: 'FilterBy', type: sql.NVarChar, value: FilterBy },
        { name: 'Page', type: sql.Int, value: Page },
        { name: 'Limit', type: sql.Int, value: Limit },
      ];

      let usersGetResult = await executeSp({
        spName: `UserDetailsGet`,
        params: params,
        connection,
      });

      // Process the users' data
      const users = usersGetResult.recordsets[0].map(user => {
        return {
          ...user,
          profiles: JSON.parse(`[${user.profiles}]`),
          Address: JSON.parse(`${user.Address}`),
        };
      });

      usersGetResult = [users, usersGetResult.recordsets[1][0]];

      handleResponse(
        response,
        200,
        'success',
        'Data retrieved successfully',
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

  /**
   *
   * Get Analytics
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next middleware
   * @returns
   */
  async getAnalytics(request, response, next) {
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

      var params = [
        EntityId({ fieldName: 'UserId', value: request.user.userId }),
      ];

      let analyticsGetResult = await executeSp({
        spName: `AnalyticsGet`,
        params: params,
        connection,
      });

      analyticsGetResult = [
        {
          PatientCount: analyticsGetResult.recordsets[0][0].PatientCount,
          CaregiverCount: analyticsGetResult.recordsets[1][0].CaregiverCount,
          HelperCount: analyticsGetResult.recordsets[2][0].HelperCount,
          DoctorCount: analyticsGetResult.recordsets[3][0].DoctorCount,
          UserCount: analyticsGetResult.recordsets[4][0].UserCount,
          AdminUserCount: analyticsGetResult.recordsets[5][0].AdminUserCount,
        },
      ];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        analyticsGetResult[0]
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
