import jwt from 'jsonwebtoken';
import { EntityId } from '../utils/type-def.js';
import executeSp from '../utils/exeSp.js';

export const isAuthorizedCaregiver = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.slice(7, authorization.length);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      res.status(401).send({ message: 'Unauthorized' });
    } else {
      req.user = decode;
      if (req.user?.userId === req.body.PatientUserId) {
        next();
      } else {
        let connection = req.app.locals.db;

        var params1 = [StringValue({ fieldName: 'Email', value: Email })];
        try {
          let userData = await executeSp({
            spName: `UserGetByEmail`,
            params: params1,
            connection,
          });

          if (!userData) {
            throw Error('User not found');
          } else if (userData.recordsets[0][0].IsCaregiver === true) {
            let params2 = [
              EntityId({
                fieldName: 'PatientUserId',
                value: req.body.PatientUserId,
              }),
              EntityId({
                fieldName: 'CaregiverUserId',
                value: req.user.UserId,
              }),
            ];

            try {
              let PatientCaregiverInfo = await executeSp({
                spName: `PatientCaregiverGet`,
                params: params2,
                connection,
              });

              if (!PatientCaregiverInfo) {
                res.status(401).send({
                  message: 'You are not allowed to perform this action',
                });
              } else {
                next();
              }
            } catch (error) {
              res.status(401).send({
                message: 'You are not allowed to perform this action',
              });
            }
          } else {
            next();
          }
        } catch (error) {
          res.status(401).send({ message: 'Failed to perform this action' });
        }
      }
    }
  });
};
