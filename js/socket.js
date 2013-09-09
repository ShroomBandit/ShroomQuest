module.define('socket', function() {

    var model = module.import('model'),
    
        socket,
    
    init = function() {
        socket = new WebSocket('ws://74.196.225.2:8083');
        socket.onopen = function() {
            console.log('Socket opened!');
        };
        socket.onmessage = function(raw) {
            var msg = JSON.parse(raw.data);
            if(msg.type === 'chat') {
                document.getElementById('chatHistory').insertAdjacentHTML('beforeend', '<div>' + msg.data + '</div>');
            }else if(msg.type === 'players') {
                model.players = msg.data;
            };
        };
        socket.onclose = function() {
            console.log('Socket closed!');
        };
    },

    send = function(type, data) {
        try {
            socket.send(JSON.stringify({
                type:type,
                data:data
            }));
        }catch(exception) {
            console.log(exception);
        };
    };

    return {
        init:init,
        send:send
    };
});
