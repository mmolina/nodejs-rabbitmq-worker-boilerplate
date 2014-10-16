// Load environment config
var cfg = require('./config');

var context = require('rabbit.js').createContext(cfg.rabbitmq.uri);

context.on('ready', function() {
  var pusher = context.socket('PUSH', {
    persistent: true  // Keep messages over restarts, write them to disk
    , prefetch: 1     // Wait for ACK before sending another message
  });

  var stop = function(){
    context.close();
  }

  pusher.connect(cfg.rabbitmq.queue, function() {
    setInterval( function() {
      var msg = {msg: 'Hello World! '+Date.now()};
      sendMsg(pusher, msg);
    }, 2000);

    var sendMsg = function(pusher, msg) {
      // Send a message, with occasional malformed messages
      var randomOpt = Math.round(Math.random()*10);
      var msg = '';
      if(randomOpt != 1) {
        msg = {
          msg: "Hello World!"
          , now: new Date().getTime()
        };
        msg = JSON.stringify(msg, cfg.rabbitmq.encoding)
      }
      else {
        msg = "This is not JSON";
      }
      pusher.write(msg);
    };

  });
});

// ToDo - on error connecting, log/complain


context.on('error', function() {
  console.warn;
});

// process.on('SIGINT', stop);
