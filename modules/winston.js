const winston = require('winston')

let logger = winston.createLogger({
    level: (process.env.NODE_ENV === 'production') ? 'info' : 'silly',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            if (info.response && info.response.data && info.response.data.error) {
                return `${info.timestamp} [incredbot][${info.level}]: ${info.message} - ${info.response.data.error.message}`
            }
            return `${info.timestamp} [incredbot][${info.level}]: ${info.message}`;
        })
    ),
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            handleExceptions: true
        })
    ]
})


module.exports = logger;
