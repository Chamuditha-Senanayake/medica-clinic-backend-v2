// const logger = require("../utils/logger");

import { logger } from "../../medica-clinic-backend-v2/utils/logger.js";

export const loggerMiddleware = (request, response, next) => {
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
  next();
};
