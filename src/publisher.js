const moment = require('moment');
const redis = require('redis');
const logger = require('../lib/logger');
const client = redis.createClient({ host: 'redis', detect_buffers: true });

module.exports = (time, message) => {
  client.keys('node:*', (error, keys) => {
    if(error) throw error;

    const multi = client.multi();
    const mTime = moment(time);

    if(mTime.isBefore(moment().utc())) {
      logger.error('The schedule  time cannot be from the past', { passedTime: mTime.format(), currentTime: moment().utc().format() });

      process.exit(0);
    }

    keys.map(key => {
      multi.zadd([key, mTime.unix(), message], redis.print)
    });

    multi.exec((error) => {
      if(error) throw error;

      logger.info('The message will be printed in terminal of the following machines', { hosts: keys });

      process.exit(0);
    });
  })
};
