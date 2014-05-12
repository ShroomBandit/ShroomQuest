var webServer = require('./webServer'),
    wsServer = require('ws').Server,

    webSocketServer = Object.create(webServer);

webSocketServer.init = function(root, port) {
    var self = this;
    webServer.init.call(this, root, port);
    wsServer.prototype.broadcast = function(message) {
        for(var i = 0, ilen = this.wss.clients.length; i < ilen; i++) {
            this.clients[i].send(msg);
        };
    };
    this.socket = new wsServer({server:this.http});
    this.socket.on('connection', function(ws) {
        self.onConnection(ws);
    });

    this.onConnection = function() {};
};

module.exports = webSocketServer;
