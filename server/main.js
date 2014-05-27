var WebServer       = require('./WebServer'),
    WebSocketServer = require('./WebSocketServer'),
    worldManager    = require('./worldManager'),

    webServer;

function handleMessage(event, data, respond, socket) {
    var playerData = {},
        world;

    switch (event) {
        case 'login':
            // authenticate
            if (false) {
                respond('loginFailed')
            } else {
                // get info from database...
                playerData.username = data.username;
                if (worldManager.assignPlayer(data.world, playerData, socket.upgradeReq.connection.remoteAddress)) {
                    world = worldManager.getWorld(data.world);
                    if (world !== null) {
                        respond('authSuccess', world.server.port);
                        socket.close();
                    } else {
                        respond('error', 'internal error')
                    }
                } else {
                    respond('worldList', worldManager.getWorldList());
                }
            }
            break;
    }
}

webServer = WebServer.create(__dirname + '/../client', 8080);
WebSocketServer.create({server: webServer.http})
    .on('connection', function (socket) {
        function respond (event, data) {
            socket.send(JSON.stringify({
                event:  event,
                data:   data
            }));
        }

        respond('worldList', worldManager.getWorldList());

        socket.on('message', function(json) {
            var msg = JSON.parse(json);
            handleMessage(msg.event, msg.data, respond, socket);
        });
    });
