export const validateMedicaToken = async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  const userAgent = req.headers['user-agent'];
  const clientIp = req.ip || req.connection.remoteAddress;
  try {
    if (
      req.path.endsWith('/Authenticate') ||
      req.path.endsWith('/RefreshToken')
    ) {
      next();
    } else {
      if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split(' ')[1];
        req.token = token;

        console.log(token);
        const response = await fetch(
          process.env.GAS_BASE_URL + '/auth/validate-token',
          {
            method: 'POST',
            body: JSON.stringify({
              token: token,
            }),
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': userAgent,
              'X-Client-IP': clientIp,
            },
          }
        );

        if (response.status === 200) {
          req.token = token;
          next();
        } else {
          res
            .status(401)
            .json({ message: 'Unauthorized: Invalid bearer token' });
        }
      } else {
        if (!req.body.Token) {
          res
            .status(401)
            .json({ message: 'Unauthorized: No bearer token found' });
        } else {
          next();
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Unauthorized: Invalid bearer token' });
  }
};
