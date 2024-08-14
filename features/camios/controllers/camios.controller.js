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

const CamiosController = {
  /**
   *
   * get camios request
   *
   * @param {request} request object
   * @param {response} response object
   * @param {next} next - middleware
   * @returns
   */
  async getCamiosRequest(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: ResponseMessage.Camios.VALIDATION_ERROR,
        data: errors,
      });
    }

    try {
      let connection = request.app.locals.db;
      const { Id, DoctorId, SessionId, AppointmentId, PatientId, UserId } =
        request.body;

      var params = [
        EntityId({ fieldName: 'Id', value: Id }),
        EntityId({ fieldName: 'DoctorId', value: DoctorId }),
        EntityId({ fieldName: 'SessionId', value: SessionId }),
        EntityId({ fieldName: 'AppointmentId', value: AppointmentId }),
        EntityId({ fieldName: 'PatientId', value: PatientId }),
        EntityId({ fieldName: 'UserId', value: UserId }),
      ];

      let CamiosRequestGetResult = await executeSp({
        spName: `CamiosRequestGet`,
        params: params,
        connection,
      });

      CamiosRequestGetResult = CamiosRequestGetResult.recordsets[0];

      handleResponse(
        response,
        200,
        'success',
        'Data retrived successfully',
        CamiosRequestGetResult
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

  // /**
  //  *
  //  * save camios request
  //  *
  //  * @param {request} request object
  //  * @param {response} response object
  //  * @param {next} next function
  //  * @returns
  //  */
  // async saveCamiosRequest(request, response, next) {
  //   const errors = validationResult(request);
  //   if (!errors.isEmpty()) {
  //     return response.status(422).json({
  //       error: true,
  //       message: ResponseMessage.Camios.VALIDATION_ERROR,
  //       data: errors,
  //     });
  //   }

  //   try {
  //     let connection = request.app.locals.db;
  //     const {
  //       Id,
  //       DoctorId,
  //       SessionId,
  //       AgeYears,
  //       AgeMonths,
  //       AppointmentId,
  //       PatientId,
  //       SymptomsReported,
  //       CamiosDifferentDiagnosisByContributoryProbability,
  //       CamiosDifferentDiagnosisByExpanatoryProbability,
  //       CamiosFinalDiagnosis,
  //       CamiosDiagnosticStatic,
  //       Status,
  //       UserSaved
  //     } = request.body;

  //   const CamiosDifferentDiagnosisByContributoryProbabilityList = [];
  //   const CamiosDifferentDiagnosisByExpanatoryProbabilityList = [];
  //   const CamiosFinalDiagnosisList = [];
  //   const CamiosDiagnosticStaticList = [];

  //   CamiosDifferentDiagnosisByContributoryProbability.forEach((camiosDifferentDiagnosisByContributoryProbability) => {
  //       CamiosDifferentDiagnosisByContributoryProbabilityList.push([]);
  //   });
  //   CamiosDifferentDiagnosisByExpanatoryProbability.forEach((camiosDifferentDiagnosisByExpanatoryProbability) => {
  //       CamiosDifferentDiagnosisByExpanatoryProbabilityList.push([]);
  //   });
  //   CamiosFinalDiagnosis.forEach((camiosFinalDiagnosis) => {
  //       CamiosFinalDiagnosisList.push([]);
  //   });
  //   CamiosDiagnosticStatic.forEach((camiosDiagnosticStatic) => {
  //       CamiosDiagnosticStaticList.push([]);
  //   });

  //   var params = [
  //     EntityId({ fieldName: "Id", value: Id }),
  //     EntityId({ fieldName: "DoctorId", value: DoctorId }),
  //     EntityId({ fieldName: "SessionId", value: SessionId }),
  //     EntityId({ fieldName: "AgeMonths", value: AgeMonths }),
  //     EntityId({ fieldName: "AgeYears", value: AgeYears }),
  //     EntityId({ fieldName: "AppointmentId", value: AppointmentId }),
  //     EntityId({ fieldName: "PatientId", value: PatientId }),
  //     StringValue({ fieldName: "SymptomsReported", value: SymptomsReported }),
  //     EntityId({ fieldName: "Status", value: Status }),
  //     EntityId({ fieldName: "UserSaved", value: UserSaved }),

  //     TableValueParameters({
  //       tableName:"CamiosDifferentDiagnosisByContributoryProbability",
  //       columns:
  //       [],
  //       values:CamiosDifferentDiagnosisByContributoryProbabilityList
  //     }),
  //     TableValueParameters({
  //       tableName:"CamiosDifferentDiagnosisByExpanatoryProbability",
  //       columns:
  //       [],
  //       values:CamiosDifferentDiagnosisByExpanatoryProbabilityList
  //     }),
  //     TableValueParameters({
  //       tableName:"CamiosFinalDiagnosis",
  //       columns:
  //       [],
  //       values:CamiosFinalDiagnosisList
  //     }),
  //     TableValueParameters({
  //       tableName:"CamiosDiagnosticStatic",
  //       columns:
  //       [],
  //       values:CamiosDiagnosticStaticList
  //     })
  //   ];

  //     let CamiosRequestSaveResult = await executeSp({
  //       spName: `CamiosRequestSave`,
  //       params: params,
  //       connection,
  //     });

  //     console.log(CamiosRequestSaveResult.recordsets);
  //     CamiosRequestSaveResult = CamiosRequestSaveResult.recordsets;

  //     handleResponse(
  //       response,
  //       200,
  //       "success",
  //       "Data retrieved successfully",
  //       CamiosRequestSaveResult
  //     );
  //   } catch (error) {
  //     handleError(
  //       response,
  //       500,
  //       "error",
  //       error.message,
  //       "Something went wrong"
  //     );
  //     next(error);
  //   }
  // },
};

export default CamiosController;
