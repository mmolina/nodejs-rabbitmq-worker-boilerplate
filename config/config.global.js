var config = module.exports = {};

// These are the default configuration options
// They will be overwritten (if it's required) by config.prod.js,
// config.dev.js, etc.
// Note: config.prod.js is ignored in the repo on purpose

// We default to production env, to prevent ever running live as dev
config.env = 'prod';
config.app = 'wrk.domain.com';
config.hostname = 'domain.com';

// The port might be defined by the deployment service, but default here
config.port = '8080';

// RabbitMQ server/queue
config.rabbitmq = {};
config.rabbitmq.encoding = 'utf8';
// config.rabbitmq.uri = process.env.RABBIT_URI || 'amqp://localhost';
// config.rabbitmq.queue = 'myqueue';

// mongo database
// config.mongo = {};
// config.mongo.uri = process.env.MONGO_URI || 'localhost';
// config.mongo.db = 'mydb';

// logs. Log to files. In dev and testing will just log to the console
config.logstreams = [
  // log INFO and above to a file
  {
    level: 'info',
    type: 'rotating-file',
    path: 'logs/' + config.app + '.log',
    period: '1d',   // daily rotation
    count: 3        // keep 3 back copies
  },
  // log ERROR and above to a file
  {
    level: 'error',
    type: 'rotating-file',
    path: 'logs/' + config.app + '-error.log',
    period: '1d',   // daily rotation
    count: 3        // keep 3 back copies
  }
];
