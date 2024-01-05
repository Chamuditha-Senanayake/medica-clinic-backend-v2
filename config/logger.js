const {createLogger, transports, format} = require('winston');

const option = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        format: format.combine(
            format.colorize()
        ),
        colorize: true,
    },
};

const logger = createLogger({
    transports: [
        new transports.Console(option.console),
    ],
    exitOnError: false, // do not exit on handled exceptions
    format: format.combine(format.printf((info) => {
            let message = ` ${dateFormat()}  ${info.level.toUpperCase()} ${info.path ? info.path : ""}  ${info.message}  `;
            message = info.obj ? message + `data:${JSON.stringify(info.obj)}  ` : message;
            return message
        }),
        format.colorize(),
        format.timestamp(),
        format.align(),
    )
});

function dateFormat() {
    let date = new Date();
    return date.toLocaleString();
}

module.exports = {
    debug: function (message, obj, filePath) {
        if (obj) {
            const path = filePath != null ? filePath.split(/[\\/]/).pop() : '';
            debugWithData(message, {"data": obj, path});
            return;
        }
        logger.debug(message);
    },
    info: function (message) {
        logger.info(message);
    },
    error: function (message) {
        logger.error(message);
    },
    debugWithData: function (message, obj) {
        logger.log('debug', message, {
            obj
        });
    },
    errorWithData: function (message, obj) {
        logger.log('error', message, {
            obj
        });
    },
    infoWithData: function (message, obj) {
        logger.log('info', message, {
            obj
        });
    }
}