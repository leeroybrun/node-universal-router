Same principe as Sails, Socket.io and Express routes bind to the same controller.

## How it works

### Router

#### Internal router

Private internal router (Express) permit to route requests from Socket.io to an existing route.

#### Add routes

When we add routes we :
- add them to routes object
- add them to private router
- emits a "router:add" event.

#### router.route

https://github.com/balderdashy/sails/blob/master/lib/router/index.js#L130

We build a generic "req" object (https://github.com/balderdashy/sails/blob/master/lib/router/req.js).

We build a generic "res" object (https://github.com/balderdashy/sails/blob/master/lib/router/res.js).

We pass through middlewares :

- qsParser
- parseCookies
- loadSession
- bodyParser

Then we route the request to the internal private router (https://github.com/balderdashy/sails/blob/master/lib/router/index.js#L216) and handle error if no route match the request.

##### Generic "req" object

https://github.com/balderdashy/sails/blob/master/lib/router/req.js

##### Generic "res" object

https://github.com/balderdashy/sails/blob/master/lib/router/res.js

....

On "finish" stream event, we call the original "req" object _clientCallback. This will return result to client.

### Express (HTTP hook)

Requests don't go through Router, they stay on Express server.

The Express server listen for "router:add" events, and then bind new routes to it's own router.
When a request hit a route from HTTP, it directly go throught Express router and the controller is called. The request will never hit the Router module.

### Socket.io

When the Socket.io server is started, it wait for a client to connect (Socket.io "connection" event).
It then register events for main HTTP methods (GET, POST, PUT, DELETE for now).

When a message hit one of those events, it is parsed to build a partial "req" (https://github.com/balderdashy/sails-hook-sockets/blob/master/lib/receive-incoming-sails-io-msg.js#L73) and "res" objects (https://github.com/balderdashy/sails-hook-sockets/blob/master/lib/receive-incoming-sails-io-msg.js#L144).

The request is then passed to the main app Router (https://github.com/balderdashy/sails-hook-sockets/blob/master/lib/receive-incoming-sails-io-msg.js#L225).

#### Partial req

- ip
- port
- socket
- url
- method
- body (what about params for GET queries ?)
- headers
    - host
    - cookie
    - origin (from handshake origin)

#### Partial res

- _clientCallback(res) : function to call to return response to client (socket.io will use the socket.io socket callback) (https://github.com/balderdashy/sails-hook-sockets/blob/master/lib/receive-incoming-sails-io-msg.js#L147)

#### Pub/Sub

https://github.com/balderdashy/sails-hook-sockets/tree/master/lib/sails.sockets

#### Broadcast

https://github.com/balderdashy/sails-hook-sockets/tree/master/lib/sails.sockets

#### Send messages/notifications ?

https://github.com/balderdashy/sails-hook-sockets/tree/master/lib/sails.sockets