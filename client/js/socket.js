spider.define(function (require) {

    var isOpen = false,
        registry = {};

    function open(host) {
        socket = new WebSocket('ws://' + host);
        socket.onopen = function() {
            console.log('Socket opened!');
            isOpen = true;
            //send('login', username);
        };
        socket.onmessage = function(raw) {
            var msg = JSON.parse(raw.data);
            if (!Array.isArray(msg)) {
                processMessage(msg.event, msg.data);
            } else {
                for (var i = 0; i < msg.length; i++) {
                    processMessage(msg[i].event, msg[i].data);
                }
            }
        };
        socket.onclose = function() {
            console.log('Socket closed!');
            isOpen = false;
            processMessage('socketclose');
        };
    }

    function processMessage(event, data) {
        if (event in registry) {
            registry[event](data);
        }
    }

    function register(event, callback) {
        if (typeof event === 'object') {
            Object.keys(event).forEach(function (evt) {
                register(evt, event[evt]);
            });
        } else {
            registry[event] = callback;
        }
        return this;
    }

    function reset() {
        registry = {};
        return this;
    }

    function send(event, data) {
        if (isOpen) {
            socket.send(JSON.stringify({
                event:event,
                data:data
            }));
        }
    }

    return {
        open:       open,
        register:   register,
        reset:      reset,
        send:       send
    }

});
