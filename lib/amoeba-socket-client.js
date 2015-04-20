var uuid = require('node-uuid');
var Socket = require('socket.io-client');

SocketClient = function(config) {
    this.config = config;
    this.socket = null;
    this.callbacks = {};
    this.requestId = 0;
};

SocketClient.prototype.init = function(amoeba, onadded) {
    var self = this;
    this.socket = new Socket(this.config.url, {
        forceNew: true,
        reconnection: false
    });
    this.socket.on('connect', function() {

        self.socket.on('result', function(response) {
            self.result(response);
        });
        self.socket.on('event', function(data) {
            amoeba.path(data.path).emit(data.event, data.data);
        });
        if (onadded) {
            onadded(null, {
                success: true
            });
        }
    });
};

SocketClient.prototype.save = function(callback) {
    var genID = uuid.v4();
    this.callbacks[genID] = callback;
    return genID;
};

SocketClient.prototype.invoke = function(context, next) {

    var data = {
        path: context.request.path,
        method: context.request.method
    };

    if (typeof(context.request.arguments) != "undefined") {
        data.arguments = context.request.arguments;
    }

    if (typeof(context.response) != "undefined") {
        data.id = this.save(function(err, result) {
            context.response.result = result;
            context.response.error = err;
            next();
        });
    } else {
        next();
    }
    this.socket.emit('invoke', data);

};

SocketClient.prototype.result = function(response) {
    if (this.callbacks[response.id]) {
        this.callbacks[response.id](response.error, response.result);
        delete this.callbacks[response.id];
    }
};

module.exports = exports = SocketClient;
