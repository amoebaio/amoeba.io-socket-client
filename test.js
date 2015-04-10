    var amoeba = new Amoeba();
    var port = 8090;

    amoeba.path("auth").as(new SocketClient({
        url: "http://localhost:" + port
    }), function() {
        amoeba.path("auths").as(new SocketClient({
            url: "http://localhost:" + port
        }), function() {

            QUnit.test("Socket client invoke success", function(assert) {
                var done = assert.async();

                amoeba.path("auth").invoke("login", {
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

                amoeba.path("auth").invoke("login", {
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
                amoeba.path("auths").invoke("login", {
                    login: 'admin',
                    password: 'pass'
                }, function(err, data) {
                    assert.ok(err !== null);
                    done();
                });
            });


            QUnit.test("unknown method", function(assert) {
                var done = assert.async();
                assert.expect(1);
                amoeba.path("auth").invoke("logins", {
                    login: 'admin',
                    password: 'pass'
                }, function(err, data) {
                    assert.equal(err.message, "Object 'auth' has no method 'logins'");
                    done();
                });
            });
        });
    });
