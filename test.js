    var socket = io('http://localhost:8090', {
        forceNew: true,
        reconnection: false
    });
    var amoeba = new Amoeba();
    socket.on('connect', function() {
        console.log('connected');
        amoeba.use("auth", new SocketClient(socket));
        amoeba.use("auths", new SocketClient(socket));

        QUnit.test("Socket client invoke success", function(assert) {
            var done = assert.async();

            amoeba.use("auth").invoke("login", {
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

            amoeba.use("auth").invoke("login", {
                login: 'admins',
                password: 'admin'
            }, function(err, data) {
                assert.equal(data, null);
                assert.equal(err.res, "login fail");
                done();
            });
        });

        QUnit.test("unknown use", function(assert) {
            var done = assert.async();
            assert.expect(1);
            amoeba.use("auths").invoke("login", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                assert.ok(err!==null);
                done();
            });
        });


        QUnit.test("unknown method", function(assert) {
            var done = assert.async();
            assert.expect(1);
            amoeba.use("auth").invoke("logins", {
                login: 'admin',
                password: 'pass'
            }, function(err, data) {
                console.log(arguments);
                assert.equal(err.message, "Object 'auth' has no method 'logins'");
                done();
            });
        });
    });
