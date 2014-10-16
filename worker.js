// Load environment config
var cfg = require('./config');

// Load the http module to create an http server for status monitoring
var http = require('http');

// Initialize default values for data structures
var startupTime = Math.round(new Date().getTime() / 1000);

var stats = {
  uptime: 0
  , messages: {
    total: 0
    , badMessages: 0
    , lastMsgSeen: startupTime
  }
};

// Create rabbit context
var context = require('rabbit.js').createContext(cfg.rabbitmq.uri);


context.on('ready', function() {
  var worker = context.socket('WORKER', {
    persistent: true  // Keep messages over restarts, write them to disk
    , prefetch: 1     // Wait for ACK before sending another message
  });

  worker.connect(cfg.rabbitmq.queue);
  worker.setEncoding(cfg.rabbitmq.encoding);

  function work(){
    var rawData = this.read();
    // console.log(rawData);
    if(rawData) {
      try{
        data = JSON.parse(rawData);
      }catch(e){
        data = null;
        // The data doesn't seem to be valid JSON, it's a malformed message
        // Log the issue, count it, and discard the message
        // ToDo LOG IT!
        stats.messages.badMessages++;
        worker.ack();
      }
    }

    stats.messages.total++;
    stats.messages.lastMsgSeen = Math.round(new Date().getTime() / 1000);

    // If everything went OK, ACK this message, and get the next one
    // As a dummy test, we are checking the msg field on the message JSON
    if(data && data["msg"]=="Hello World!"){
      worker.ack();
    }
    else if(false){
      // Maybe we'd prefer re-queueing it - for the moment we discarded it
      worker.requeue();
    }
  }

  worker.on('readable', work);

});

context.on('error', function() {
  console.log("error!");
  console.warn;
});

// Configure a HTTP server to respond with the status to all requests
// ToDo - This shouldn't be public, or should be protected if it was
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "application/json"});
  // Update stats and return
  var now = Math.round(new Date().getTime() / 1000);
  stats.uptime = now - startupTime;
  response.end(JSON.stringify(stats));
});

// Listen on for requests
server.listen(cfg.port);
