import jwt from 'jsonwebtoken';

export const isCaregiver = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.slice(7, authorization.length);
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(401).send({ message: 'Unauthorized' });
    } else {
      req.user = decode;

      console.log(req.body);

      next();
    }
  });
};
