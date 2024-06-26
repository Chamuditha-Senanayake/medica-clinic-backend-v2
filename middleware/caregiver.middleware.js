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

        let params = [
          EntityId({
            fieldName: 'PatientUserId',
            value: req.body.UserId,
          }),
          EntityId({
            fieldName: 'CaregiverUserId',
            value: req.user.PatientUserId,
          }),
        ];

        try {
          let PatientCaregiverInfo = await executeSp({
            spName: `PatientCaregiverGet`,
            params: params,
            connection,
          });

          if (!PatientCaregiverInfo) {
            res
              .status(401)
              .send({ message: 'You are not allowed to perform this action' });
          } else {
            next();
          }
        } catch (error) {
          res
            .status(401)
            .send({ message: 'You are not allowed to perform this action' });
        }
      }
    }
  });
};
