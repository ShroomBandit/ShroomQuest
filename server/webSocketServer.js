var webServer = require('./webServer'),
    WebSocketServer = require('ws').Server;

exports.create = function(root, port) {
    var registry = {},
        server = webServer.create(root, port),
        wss = new WebSocketServer({server:server}),

    broadcast = function(event, data) {
        var msg = JSON.stringify({
            event:event,
            data:data
        });
        for(var i in wss.clients) {
            wss.clients[i].send(msg);
        };
    },

    listen = function(event, fn) {
        if(!(event in registry)) {
            registry[event] = [];
        };
        registry[event].push(fn);
    },

    emit = function(event, data) {
        if(event in registry) {
            for(var i = 0; i < registry[event].length; i++) {
                registry[event][i](data);
            };
        };
    },

    isActive = function() {
        if(wss.clients.length === 0) {
            return false;
        }else{
            return true;
        };
    };

    wss.on('connection', function(ws) {
        emit('open', ws);
        ws.on('close', function() {
            emit('close');
        });
    });

    return {
        broadcast:broadcast,
        isActive:isActive,
        listen:listen
    };

};
