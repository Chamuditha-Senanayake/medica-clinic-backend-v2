import { info } from '../config/logger.js';

export default function loggerMiddleware(request, response, next) {
  info(`Start processing the request(loggerMiddleware)`);
  const newObj = {};
  info(
    `Request Method: ${request.method} | Request Path: ${
      request.path
    } | Request Data: ${JSON.stringify(newObj)}`
  );

  return next();
}
