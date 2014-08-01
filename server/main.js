'use strict';

var createSync      = require('../shared/Sync.js'),
    WebServer       = require('./WebServer'),
    WebSocketServer = require('./WebSocketServer'),
    worldManager    = require('./worldManager'),

    webServer = WebServer.create(__dirname + '/..', 8080);


//webServer.rewrite(/^(?!\/shared)(.*)$/, '/client$1');
//webServer.rewrite(/^$/, '/client/index.html');

WebSocketServer.create({server: webServer.http})
    .on('connection', function (socket) {
        var Sync = createSync(socket),

            loginStatus = Sync.create('loginStatus'),
            port        = Sync.create('port'),
            worldList   = Sync.create('worldList', worldManager.getWorldList());

        Sync.create('loginData', {}, {watch: true, silently: true}).on('change', function (data) {
            data.username;
            data.world;
            // authenticate
            if (false) {
                loginStatus.set('Login failed.');
            } else {
                //playerData = data from database...
                playerData = {};
                playerData.username = data.username;
                if (worldManager.assignPlayer(data.world, playerData, socket.upgradeReq.connection.remoteAddress)) {
                    world = worldManager.getWorld(data.world);
                    if (world !== null) {
                        port.set(world.server.port);
                        socket.close();
                    } else {
                        // Fix this...
                        console.log('Internal error: could not get world. <server/main.js:37>')
                    }
                } else {
                    worldList.set(worldManager.getWorldList());
                }
            }
        });
    });
