var WebSocketServer = require('./webSocketServer'),
    WorldServer = require('./worldServer'),

    server = new WebSocketServer(__dirname+'/..', 8083),
    world = false;

server.onConnection = function(ws) {
    if(!world) {
        world = new WorldServer(0, server);
    };
    if(!world.running) {
        world.start();
    };
    world.addPlayer(ws);
    ws.on('close', function() {
        world.stop();
    });
};
