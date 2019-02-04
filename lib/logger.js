const hostname = require('os').hostname();
const winston = require('winston');
const host = `node:${hostname}`;

module.exports = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { host },
  transports: [
    new winston.transports.Console()
  ]
});
