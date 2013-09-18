module.define('socket', function() {
    
    var socket,
        registry = {},
    
    open = function(ip) {
        socket = new WebSocket('ws://' + ip);
        socket.onopen = function() {
            console.log('Socket opened!');
            emit('open', false);
        };
        socket.onmessage = function(raw) {
            var msg = JSON.parse(raw.data);
            if(!Array.isArray(msg)) {
                emit(msg.event, msg.data);
            }else{
                for(var i = 0, ilen = msg.length; i < ilen; i++) {
                    emit(msg[i].event, msg[i].data);
                };
            };
        };
        socket.onclose = function() {
            console.log('Socket closed!');
            emit('close', false);
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
            for(var i = 0, ilen = registry[event].length; i < ilen; i++) {
                registry[event][i](data);
            };
        };
    },

    unlisten = function(event, fn) {
        for(var i = 0, ilen = registry[event].length; i < ilen; i++) {
            if(registry[event][i] === fn) {
                registry[event].splice(i, 1);
            };
        };
    },

    send = function(event, data) {
        try {
            socket.send(JSON.stringify({
                event:event,
                data:data
            }));
        }catch(exception) {
            console.log(exception, event);
        };
    };

    return {
        open:open,
        listen:listen,
        send:send
    };
});
