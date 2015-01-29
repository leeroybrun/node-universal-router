var EventEmitter = require('events').EventEmitter;
var util = require('util');

var express = require('express');

var Router = function() {
    EventEmitter.call(this);

    // Remove memory-leak warning about max listeners
    // See: http://nodejs.org/docs/latest/api/events.html#events_emitter_setmaxlisteners_n
    this.setMaxListeners(0);

	this.routes = {};

    this._privateRouter = Express();
};

util.inherits(Router, EventEmitter);

Router.prototype.add = function(newRoutes) {
    var router = this;

    // Fire events for all routes added and add them to "routes"
    for(var path in newRoutes) {
        if(typeof router.routes[path] === 'undefined') {
            router.routes[path] = {};
        }

        for(var method in newRoutes[path]) {
            router.routes[path][method] = newRoutes[path][method];

            router.emit('route:add', {
                method: method,
                path: path,
                target: newRoutes[path][method]
            });
        }
    }
};

Router.prototype.route = function(req, res) {
    this._privateRouter.router(req, res, function handleUnmatchedNext(err) {

    });
};

// Register a new server
Router.prototype.register = function(server) {

};

module.exports = Router;