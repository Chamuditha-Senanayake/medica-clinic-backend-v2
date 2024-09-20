import jwt from 'jsonwebtoken';
import { EntityId } from '../utils/type-def.js';
import executeSp from '../utils/exeSp.js';

export const isSuperAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.slice(7, authorization.length);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      res.status(401).send({ message: 'Unauthorized' });
    } else {
      req.user = decode;

      if (req.user.userId) {
        let connection = req.app.locals.db;

        var params = [EntityId({ fieldName: 'Id', value: req.user.userId })];
        try {
          let userData = await executeSp({
            spName: `UserGetById`,
            params: params,
            connection,
          });

          if (!userData) {
            throw Error('User not found');
          } else if (userData.recordsets[0][0].UserRole === 1) {
            next();
          } else {
            res.status(401).send({
              message: 'You are not allowed to perform this action',
            });
          }
        } catch (error) {
          console.log(error.message);
          res.status(401).send({ message: 'Failed to perform this action' });
        }
      }
    }
  });
};
