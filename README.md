#Socket client for amoeba.io
See also https://github.com/amoebaio/amoeba.io-socket-server

##Installation
```
npm install amoeba.io-socket-client
```

##Usage
```javascript
var Amoeba = require("amoeba.io");
var SocketClient = require("amoeba-socket-client");

var amoeba = new Amoeba();

amoeba.path("chat").as(new SocketClient({
            url: "http://localhost:8090"
        }), function(err, result) {
            if(!err){
                //connected
            }
        });
```