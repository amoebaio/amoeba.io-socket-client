var uuid = require('node-uuid');
var util = require('util');
var EventEmitter = require('events').EventEmitter;


SocketClient = function(socket) {
    var self = this;
    this.callbacks = {};
    this.requestId = 0;
    this.socket = socket;
    this.socket.on('result', function(response) {
        self.result(response);
    });
    this.socket.on('event', function(data) {
        self.emit(data.use + "." + data.event, data.data);
    });
};

util.inherits(SocketClient, EventEmitter);

SocketClient.prototype.save = function(callback) {
    var genID = uuid.v4();
    this.callbacks[genID] = callback;
    return genID;
};

SocketClient.prototype.invoke = function(context, callback) {

        var data={
            use: context.request.use,
            method: context.request.method
        };
        
        if (typeof(context.request.params) != "undefined") {
            data.params = context.request.params;
        }

        if(typeof(callback)!="undefined"){
            data.id=this.save(callback);
        }
        this.socket.emit('invoke', data);

};

SocketClient.prototype.result = function(response) {
    if (this.callbacks[response.id]) {
        this.callbacks[response.id](response.err, response.result);
        delete this.callbacks[response.id];
    }
};

SocketClient.prototype.on = function(use, event, callback, onadded) {
    var self = this;
    EventEmitter.prototype.on.call(self, use + "." + event, callback);
    this.addListener(use, event, function(err, result) {
        if (err !== null) {
            EventEmitter.prototype.removeListener.call(self, use + "." + event, callback);
        }
        if (onadded) {
            onadded(err, result);
        }
    });
};

SocketClient.prototype.addListener = function(use, event, onadded) {
    if (this.listeners(use + "." + event).length === 1) {
        this.socket.emit('al', {
            id: this.save(onadded),
            use: use,
            event: event
        });
    } else {
        if (onadded) onadded(null, {
            success: true
        });
    }
};

SocketClient.prototype.removeListener = function(use, event, listener, onremoved) {
    EventEmitter.prototype.removeListener.call(this, use + "." + event, listener);
    if (EventEmitter.listenerCount(this, use + "." + event) === 0) {
        this.socket.emit('rl', {
            id: this.save(onremoved),
            use: use,
            event: event
        });
    } else {
        if (onremoved) onremoved(null, {
            success: true
        });
    }
};

module.exports = exports = SocketClient;
