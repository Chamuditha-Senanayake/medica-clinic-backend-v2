import { info } from "../config/logger.js";

export default function loggerMiddleware(request, response, next) {
  info(`Start processing the request(loggerMiddleware)`);
  const newObj = {
    headers: request.headers,
    body: request.body,
    query: request.query,
    params: request.params,
  };
  info(
    `Request Method: ${request.method} | Request Path: ${
      request.path
    } | Request Data: ${JSON.stringify(newObj)}`
  );

  return next();
}
