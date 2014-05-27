var WSServer = require('ws').Server;

WSServer.prototype.broadcast = function(message) {
    for(var i = 0; i < this.clients.length; i++) {
        this.clients[i].send(msg);
    }
}

module.exports = {

    create: function (options) {
        var wss = new WSServer(options);

        if ('port' in options) {
            wss.port = options.port;
        }

        return wss;
    }

}
