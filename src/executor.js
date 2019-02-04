const CronJob = require('cron').CronJob;
const moment = require('moment');
const hostname = require('os').hostname();
const redis = require('redis');

const logger = require('../lib/logger');
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const client = redis.createClient({ host: redisHost, port: redisPort, detect_buffers: true });
const host = `node:${hostname}`;

module.exports = () => {
  client.monitor(cb_monitor);

  client.on('monitor', (execTime, args) => {
    const [ action, actionHost, time, msg ] = String(args).split(',');

    if(action === 'zadd' && actionHost === host) {
      handler({ time, msg })
    }
  });

  client.zrevrangebyscore([ host, '+inf', '-inf', 'WITHSCORES' ], (error, result) => {
    if(error) throw error;

    if(!result.length) {
      client.zadd([host, 0, 'init']);
    }

    prepare(result).map(handler);
    logger.info(`Scheduler app has been up and running...`);
  });
};

function job(msg) {
  console.log(msg);

  client.zrem(host, msg, cb_zrem);
}

function handler(item) {
  const time = moment.unix(item.time).utc();

  if(time < moment.utc() && item.time > 0) {
    job(item.msg);

    return;
  }

  const pattern = `${time.seconds()} ${time.minute()} ${time.hours()} ${time.date()} ${time.month()} *`;
  return new CronJob(pattern, () => job(item.msg), null, true, 'UTC');
}

function prepare(data) {
  const length = data.length;
  let result = [];

  for(let i = 0; i < length; i += 2) {
    result.push({ time: data[i+1], msg: data[i] })
  }

  return result;
}

function cb_monitor(error, result) {
  if(error) {
    logger.error('An error occurred', error.message);
  }

  logger.info('Check events for this host');
}

function cb_zrem(error, result) {
  if(error) {
    logger.error('An error occurred', error.message);
  }

  logger.debug('One more member successfully removed from the host');
}
