var Amoeba = require("../amoeba.io");
var LocalClient = require("../amoeba.io-local-client");
var SocketServer = require("../amoeba.io-socket-server");

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
amoeba.path("auth").as(new LocalClient(new Auth()));

new SocketServer(amoeba, {port:port});
