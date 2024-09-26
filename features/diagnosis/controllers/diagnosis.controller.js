import { validationResult } from 'express-validator';
import ResponseMessage from '../../../config/messages.js';
import executeSp from '../../../utils/exeSp.js';
import handleError from '../../../utils/handleError.js';
import handleResponse from '../../../utils/handleResponse.js';
import sql from 'mssql';

const DiagnosisController = {
  /**
   *
   * get diagnosis by name
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getDiagnosisByName(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Diagnosis.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Diagnosis, Page = 0, Limit = 0 } = request.body;

      var params = [
        { name: 'Diagnosis', type: sql.NVarChar, value: Diagnosis },
        { name: 'Page', type: sql.Int, value: Page },
        { name: 'Limit', type: sql.Int, value: Limit },
      ];

      let diagnosisGetByNameResult = await executeSp({
        spName: `DiagnosisGetByName`,
        params: params,
        connection,
      });

      if (Diagnosis == '' || Limit == 0 || Limit == null) {
        diagnosisGetByNameResult = diagnosisGetByNameResult.recordsets;
      } else {
        //Append patient prescriptions and count for pagination
        diagnosisGetByNameResult = [
          diagnosisGetByNameResult.recordsets[0],
          diagnosisGetByNameResult.recordsets[1][0],
        ];
      }

      handleResponse(
        response,
        200,
        'success',
        'Drugs retrived successfully',
        diagnosisGetByNameResult
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

export default DiagnosisController;
