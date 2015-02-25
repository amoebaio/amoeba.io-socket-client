    var socket = io('http://localhost:8090', {
        forceNew: true,
        reconnection: false
    });
    var amoeba = new Amoeba();
    socket.on('connect', function() {
        console.log('connected');
        amoeba.service("auth", new SocketClient(socket));
        amoeba.service("auths", new SocketClient(socket));

        QUnit.test("Socket client invoke success", function(assert) {
            var done = assert.async();

            amoeba.service("auth").invoke("login", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.equal(err, null);
                assert.equal(data.res, "login ok");
                done();
            });
        });


        QUnit.test("Socket client invoke error", function(assert) {
            var done = assert.async();

            amoeba.service("auth").invoke("login", {
                login: 'admins',
                password: 'admin'
            }, function(err, data) {
                assert.equal(data, null);
                assert.equal(err.res, "login fail");
                done();
            });
        });

        QUnit.test("unknown service", function(assert) {
            var done = assert.async();
            assert.expect(1);
            amoeba.service("auths").invoke("login", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.equal(err.message, "Service 'auths' not found");
                done();
            });
        });


        QUnit.test("unknown method", function(assert) {
            var done = assert.async();
            assert.expect(1);
            amoeba.service("auth").invoke("logins", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                console.log(arguments);
                assert.equal(err.message, "Service 'auth' has no method 'logins'");
                done();
            });
        });
    });
