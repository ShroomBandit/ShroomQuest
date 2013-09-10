var webServer = require('./webServer'),
    WebSocketServer = require('ws').Server,
    wss,
    clients = [],

create = function(root, port) {
    var server = webServer.create(root, port);
    /*wss = new WebSocketServer({server:server});
    wss.on('connection', function(ws) {
        emit('logon');
        clients.push(ws);
        ws.on('message', function(raw) {
            var msg = JSON.parse(raw);
            emit(msg.event, msg.data);
        });
        ws.on('close', function() {
            emit('logoff');
        });
    });*/
},

broadcast = function(msg) {
    for(var i in wss.clients) {
        wss.clients[i].send(msg);
    };
},

registry = {},
listen = function(event, fn) {
    if(!event in registry) {
        registry[event] = [];
    };
    if(!typeof registry === 'undefined') {
        registry[event].push(fn);
    };
},

emit = function(event, data) {
    for(var i = 0; i < registry[event].length; i++) {
        registry[event][i](data);
    };
},

isActive = function() {
    if(clients.length === 0) {
        return false;
    }else{
        return true;
    };
};

exports.broadcast = broadcast;
exports.create = create;
exports.isActive = isActive;
exports.listen = listen;
/*exports = {
    broadcast:broadcast,
    create:create,
    isActive:isActive,
    listen:listen
};*/