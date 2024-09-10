import { info } from '../config/logger.js';

export default function loggerMiddleware(request, response, next) {
  info(`Start processing the request(loggerMiddleware)`);
  const newObj = {
    body: request.body,
    query: request.query,
    params: request.params,
  };
  info(
    `Request Method: ${request.method} | Request Path: ${
      request.path
    } | Request Data: ${JSON.stringify(newObj)}`
  );
  info(
    `Request: ${request.method} ${request.path}\n${JSON.stringify({
      path: request.path,
      method: request.method,
      body: request.body,
      query: request.query,
      params: request.params,
    })}`
  );
  next();
}
