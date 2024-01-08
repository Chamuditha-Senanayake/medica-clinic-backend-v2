import { createLogger, transports, format } from "winston";

const option = {
  console: {
    level: "debug",
    handleExceptions: true,
    json: true,
    format: format.combine(format.colorize()),
    colorize: true,
  },
};

const logger = createLogger({
  transports: [new transports.Console(option.console)],
  exitOnError: false, // do not exit on handled exceptions
  format: format.combine(
    format.printf((info) => {
      let message = ` ${dateFormat()}  ${info.level.toUpperCase()} ${
        info.path ? info.path : ""
      }  ${info.message}  `;
      message = info.obj
        ? message + `data:${JSON.stringify(info.obj)}  `
        : message;
      return message;
    }),
    format.colorize(),
    format.timestamp(),
    format.align()
  ),
});

function dateFormat() {
  let date = new Date();
  return date.toLocaleString();
}

export function debug(message, obj, filePath) {
  if (obj) {
    const path = filePath != null ? filePath.split(/[\\/]/).pop() : "";
    debugWithData(message, { data: obj, path });
    return;
  }
  logger.debug(message);
}

export function info(message) {
  logger.info(message);
}

export function error(message) {
  logger.error(message);
}

export function debugWithData(message, obj) {
  logger.log("debug", message, {
    obj,
  });
}

export function errorWithData(message, obj) {
  logger.log("error", message, {
    obj,
  });
}

export function infoWithData(message, obj) {
  logger.log("info", message, {
    obj,
  });
}
