const {
  createLogger,
  transports,
  format,
} = require('winston');
const path = require('path');

const logger = createLogger({
  transports: [
    new transports.File({
      filename: path.join(__dirname, 'logs/info.log'),
      level: 'info',
      format: format.combine(format.timestamp(), format.simple()),
    }),
    new transports.File({
      filename: path.join(__dirname, 'logs/error.log'),
      level: 'error',
      format: format.combine(format.timestamp(), format.simple()),
    }),
  ],
});

module.exports = logger;
