var assert = require("assert");
var Amoeba = require("amoeba.io");
var LocalClient = require("amoeba.io-local-client");
var SocketServer = require("../../amoeba.io-socket-server/lib/amoeba-socket-server");
//var SocketServer = require("amoeba.io-socket-server");
var SocketClient = require("../lib/amoeba-socket-client");

var ServerIO = require('socket.io');
var Socket = require('socket.io-client');

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

//Start socket server
var port = "8090";
amoeba = new Amoeba();
amoeba.use("auth", new LocalClient(new Auth()));

io = new ServerIO();
io.listen(port).on('connection', function(socket) {
    socket.on('error', function() {
        //error received on SocketServer
    });
    amoeba.server(new SocketServer(socket));
});


describe('LocalClient', function() {
    var amoeba;

    beforeEach(function() {

    });

    it('#invoke', function(done) {
        var client_amoeba = new Amoeba();

        var socket = new Socket('http://localhost:' + port, {
            forceNew: true,
            reconnection: false
        });

        socket.on('connect', function() {
            client_amoeba.use("auth", new SocketClient(socket));
            client_amoeba.use("auth").invoke("login", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.equal(err, null);
                assert.equal(data.res, "login ok");
                socket.close();
                done();

            });
        });
    });

    it('#invoke unknown use', function(done) {
        var client_amoeba = new Amoeba();

        var socket = new Socket('http://localhost:' + port, {
            forceNew: true,
            reconnection: false
        });
        socket.on('connect', function() {
            client_amoeba.use("auths", new SocketClient(socket));
            client_amoeba.use("auths").invoke("login", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.ok(err!==null);
                socket.close();
                done();
            });
        });
    });

    it('#invoke unknown method', function(done) {
        var client_amoeba = new Amoeba();

        var socket = new Socket('http://localhost:' + port, {
            forceNew: true,
            reconnection: false
        });
        socket.on('connect', function() {
            client_amoeba.use("auth", new SocketClient(socket));
            client_amoeba.use("auth").invoke("logins", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.equal(err.message, "Object 'auth' has no method 'logins'");
                socket.close();
                done();
            });
        });
    });
});
