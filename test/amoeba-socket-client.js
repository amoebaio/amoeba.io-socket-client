var assert = require("assert");
var Amoeba = require("amoeba.io");
var LocalClient = require("amoeba.io-local-client");
var SocketServer = require("amoeba.io-socket-server");
var SocketClient = require("../lib/amoeba-socket-client");

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
amoeba.path("auth").as(new LocalClient(new Auth()));
new SocketServer(amoeba, {
    port: port
});


describe('LocalClient', function() {
    var amoeba;

    beforeEach(function() {

    });

    it('#invoke', function(done) {
        var client_amoeba = new Amoeba();

        client_amoeba.path("auth").as(new SocketClient({
            url: "http://localhost:" + port
        }), function() {
            client_amoeba.path("auth").invoke("login", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.equal(err, null);
                assert.equal(data.res, "login ok");
                done();
            });
        });
    });

    it('#invoke unknown method', function(done) {
        var client_amoeba = new Amoeba();

        client_amoeba.path("auth").as(new SocketClient({
            url: "http://localhost:" + port
        }), function() {
            client_amoeba.path("auth").invoke("logins", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.equal(err.message, "Object 'auth' has no method 'logins'");
                done();
            });
        });
    });
});
