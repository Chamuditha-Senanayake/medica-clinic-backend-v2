import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import {
  EntityId,
  StringValue,
  SignedInteger,
} from '../../../utils/type-def.js';

const EmployeeController = {
  /**
   *
   * get Employee Branch
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getEmployeeBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Employee.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, InstituteBranchId, UserId } = request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'InstituteBranchId', value: InstituteBranchId }),
        EntityId({ fieldName: 'UserId', value: UserId }),
      ];

      let employeeBranchGetResult = await executeSp({
        spName: `EmployeeBranchGet`,
        params: params,
        connection,
      });

      employeeBranchGetResult = employeeBranchGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        'success',
        'Employee data retrived successfully',
        employeeBranchGetResult
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
   * save Employee Branch
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveEmployeeBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Employee.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, InstituteBranchId, EmployeeId, Status, UserSaved } =
        request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'InstituteBranchId', value: InstituteBranchId }),
        EntityId({ fieldName: 'EmployeeId', value: EmployeeId }),
        SignedInteger({
          fieldName: 'Status',
          value: Status,
        }),
        EntityId({ fieldName: 'UserSaved', value: UserSaved }),
      ];

      let employeeBranchSaveResult = await executeSp({
        spName: `EmployeeBranchSave`,
        params: params,
        connection,
      });

      console.log(employeeBranchSaveResult.recordsets);
      employeeBranchSaveResult = employeeBranchSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Employee data retrieved successfully',
        employeeBranchSaveResult
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
   * get Employee Institute Branch
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getEmployeeInstituteBranch(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Employee.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, UserId } = request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'UserId', value: UserId }),
      ];

      let employeeInstituteBranchGetResult = await executeSp({
        spName: `EmployeeInstituteBranchGet`,
        params: params,
        connection,
      });

      employeeInstituteBranchGetResult =
        employeeInstituteBranchGetResult.recordsets;

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        employeeInstituteBranchGetResult
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
   * save a Employee
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next function
   * @returns
   */
  async saveEmployee(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Employee.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const {
        Id,
        FirstName,
        MiddleName,
        LastName,
        NIC,
        Email,
        Status,
        UserSaved,
      } = request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        StringValue({ fieldName: 'FirstName', value: FirstName }),
        StringValue({ fieldName: 'MiddleName', value: MiddleName }),
        StringValue({ fieldName: 'LastName', value: LastName }),
        StringValue({ fieldName: 'NIC', value: NIC }),
        StringValue({ fieldName: 'Email', value: Email }),
        SignedInteger({
          fieldName: 'Status',
          value: Status,
        }),
        EntityId({ fieldName: 'UserSaved', value: UserSaved }),
      ];

      let employeeSaveResult = await executeSp({
        spName: `EmployeeSave`,
        params: params,
        connection,
      });

      console.log(employeeSaveResult.recordsets);
      employeeSaveResult = employeeSaveResult.recordsets[0][0];

      handleResponse(
        response,
        200,
        'success',
        'Employee data retrieved successfully',
        employeeSaveResult
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

export default EmployeeController;
