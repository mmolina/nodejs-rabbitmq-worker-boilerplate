Boilerplate RabbitMQ worker microservice
---
This will save some time providing some scaffolding for the next microservice/RabbitMQ worker to be created.

publisher.js
--
Publishes a JSON message to the messages queue every 2 seconds. From time to time will publish invalid messages on purpose, so we can check that the worker handles them properly.

worker.js
--
Connects to the queue, and process messages as they are delivered.

At the moment it'll discard invalid messages, and just ACK valid ones.

Implements an HTTP server for monitoring purposes. The response to any HTTP request will be a status message (formatted as a JSON string), containing `uptime`, a collection of `stats`, for example:
```
{
  uptime: 56,
  messages: {
    total: 28,
    badMessages: 2,
    lastMsgSeen: 1413424521
  }
}
```
ToDo
---
* Tests.
* Logging.
* HTTP status/monitoring protected, in case we can't deploy in a demilitarised area.
* Port and other configuration values could be set by the service deploying this service.
