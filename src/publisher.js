const moment = require('moment');
const redis = require('redis');
const client = redis.createClient({ host: 'redis', detect_buffers: true });

module.exports = (time, message) => {
  client.keys('node:*', (error, keys) => {
    if(error) throw error;

    const multi = client.multi();
    keys.map(key => {
      multi.zadd([key, moment(time).unix(), message], redis.print)
    });

    multi.exec((error) => {
      if(error) throw error;

      console.log('The message will be printed in terminal of the following machines', keys);

      process.exit(0)
    });
  })
};
