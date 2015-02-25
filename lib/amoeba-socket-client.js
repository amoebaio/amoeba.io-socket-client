var uuid = require('node-uuid');

SocketClient = function(socket) {
    var self = this;
    this.callbacks = {};
    this.requestId = 0;
    this.socket = socket;
    this.socket.on('result', function(response) {
        self.result(response);
    });
};

SocketClient.prototype.save = function(callback) {
    var genID = uuid.v4();
    this.callbacks[genID] = callback;
    return genID;
};

SocketClient.prototype.invoke = function(serviceName, method, data, callback) {
    this.socket.emit('invoke', {
        id: this.save(callback),
        service: serviceName,
        method: method,
        data: data
    });
};

SocketClient.prototype.result = function(result) {
    if(this.callbacks[result.id]){
        this.callbacks[result.id](result.err, result.data);
        delete this.callbacks[result.id];
    }
};

module.exports = exports = SocketClient;
