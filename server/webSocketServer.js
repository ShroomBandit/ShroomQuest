var extend = require('./extend'),
    WebServer = require('./webServer'),
    wsServer = require('ws').Server;

module.exports = WebSocketServer = extend(WebServer, {
    init:function(root, port) {
        var self = this;
        WebServer.call(this, root, port);
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
    }
});
