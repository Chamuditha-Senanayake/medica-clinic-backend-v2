// const { createLogger, format, transports } = require("winston");

import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(
      (info) => `${info.timestamp} [${info.level}]: ${info.message}`
    )
  ),
  transports: [
    // new transports.Console(),
    new transports.File({ filename: "app.log" }),
  ],
});

