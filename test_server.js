var Amoeba = require("amoeba.io");
var LocalClient = require("amoeba.io-local-client");
var SocketServer = require("amoeba.io-socket-server");

var ServerIO = require('socket.io');

Auth = function() {};

Auth.prototype.login = function(data, callback) {
    if (data.login == "admin" && data.password == "pass") {
        callback(null, {
            "res": "login ok"
        });
    } else {
        callback({
            "res": "login fail"
        }, null);
    }

};

var port = "8090";

amoeba = new Amoeba();
amoeba.service("auth", new LocalClient(new Auth()));

io = new ServerIO();
io.listen(port).on('connection', function(socket) {
    console.log("connected");
    socket.on('error', function() {
        console.log(socket.connected);
        //error received on SocketServer
    });
    socket.on('disconnect', function() {
        console.log("desconnect");
        //error received on SocketServer
    });
    amoeba.server(new SocketServer(socket));
});
