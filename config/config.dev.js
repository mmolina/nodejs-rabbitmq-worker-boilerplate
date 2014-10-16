var config = require('./config.global');

config.env = 'dev';
config.hostname = 'localhost';
config.port = '8080';

// RabbitMQ server/queue
config.rabbitmq.uri = process.env.RABBIT_URI || 'amqp://192.168.1.20';
config.rabbitmq.queue = 'myqueue';


config.logstreams = [
  // log INFO and above to stdout
  {
    level: 'info',
    stream: process.stdout
  }
];

module.exports = config;
