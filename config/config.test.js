var config = require('./config.global');

config.env = 'test';
config.hostname = 'localhost';
config.port = '8081';

// We don't need any log when we are running tests
config.logstreams = [];

module.exports = config;
