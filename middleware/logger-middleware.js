// const logger = require("../utils/logger");

import { logger } from "../../medica-clinic-backend-v2/utils/logger.js";

export const loggerMiddleware = (req, response, next) => {
  logger.info(
    `Request: ${req.method} ${req.path}\n${JSON.stringify({
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    })}`
  );
  next();
};

