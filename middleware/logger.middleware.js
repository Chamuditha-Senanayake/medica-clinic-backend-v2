const Logger = require('../config/logger')

function loggerMiddleware(request, response, next) {
    Logger.info(`Start processing the request(loggerMiddleware)`);
    const newObj = {};
    Logger.info(`Request Method: ${request.method} | Request Path: ${request.path} | Request Data: ${JSON.stringify(newObj)}`);

    return next();
}

module.exports = loggerMiddleware;