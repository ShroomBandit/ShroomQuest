var webSocketServer = require('./webSocketServer'),
    WorldServer = require('./worldServer'),

    world = false;

webSocketServer.init(__dirname+'/../client', 8083),

webSocketServer.onConnection = function(ws) {
    if(!world) {
        world = new WorldServer(0, webSocketServer);
    };
    if(!world.running) {
        world.start();
    };
    world.addPlayer(ws);
};
