module.define('main', function() {
    
    var character = module.import('character'),
        chat = module.import('chat'),
        keys = module.import('keys'),
        map = module.import('map'),
        model = module.import('model'),
        mouse = module.import('mouse'),
        ui = module.import('ui'),
        utils = module.import('utils'),

        lastPos, socket,
        ent = document.getElementById('entities'),
        bg = document.getElementById('background'),
        entctx = ent.getContext('2d'),
        bgctx = bg.getContext('2d'),
        gameWindow = {
            x:1200,
            y:700
        },

    openSocket = function(ip) {
        socket = new WebSocket('ws://' + ip);
        socket.onopen = function() {
            console.log('Socket opened!');
            sendMessage('login', model.username);
        };
        socket.onmessage = function(raw) {
            var msg = JSON.parse(raw.data);
            if(!Array.isArray(msg)) {
                processMessage(msg.event, msg.data);
            }else{
                for(var i = 0, ilen = msg.length; i < ilen; i++) {
                    processMessage(msg[i].event, msg[i].data);
                };
            };
        };
        socket.onclose = function() {
            console.log('Socket closed!');
        };
    },

    processMessage = function(event, data) {
        switch(event) {
            case 'chat':
                chat.addToHistory(data);
                break;
            case 'loadGameData':
                chat.init(sendMessage);
                keys.init(sendMessage);
                mouse.init(sendMessage, gameWindow.x/2, gameWindow.y/2);
                map.config(data, gameWindow.x, gameWindow.y);
                // later will be load images
                map.loadTiles(step);
                break;
            case 'players':
                model.players = data;
                break;
            case 'projectiles':
                model.projectiles = data;
                break;
            case 'resourceChange':
                ui.setResource(data);
                break;
            case 'death':
                location.reload();
                break;
        };
    },

    render = function() {
        entctx.clearRect(0, 0, gameWindow.x, gameWindow.y);
        if(!('players' in model)) return false;
        var me = model.players[model.username];
        if(lastPos !== me) {
            map.draw(bgctx, me.x, me.y);
            lastPos = me;
        };
        utils.framerate(entctx, gameWindow.x - 100, 20);
        character.draw(entctx, gameWindow.x/2, gameWindow.y/2);
        for(var player in model.players) {
            if(player !== model.username) {
                character.draw(entctx, model.players[player].x - me.x + gameWindow.x/2, model.players[player].y - me.y + gameWindow.y/2);
            };
        };
        if('projectiles' in model) {
            for(var i = 0, ilen = model.projectiles.length; i < ilen; i++) {
                entctx.fillStyle = 'rgba(0,0,0,1)';
                entctx.beginPath();
                entctx.arc(model.projectiles[i].x - me.x + gameWindow.x/2, model.projectiles[i].y - me.y + gameWindow.y/2, 3, 0, Math.PI*2, false);
                entctx.closePath();
                entctx.fill();
            };
        };
    },

    sendMessage = function(event, data) {
        socket.send(JSON.stringify({
            event:event,
            data:data
        }));
    },

    step = function() {
        render();
        requestAnimationFrame(step);
    };

    ent.width = gameWindow.x;
    ent.height = gameWindow.y;
    bg.width = gameWindow.x;
    bg.height = gameWindow.y;

    document.getElementById('login').addEventListener('click', function() {
        var dialog = document.getElementById('loginDialog');
        model.username = document.getElementById('username').value;
        dialog.parentNode.removeChild(dialog);
        document.getElementById('foreground').style.display = 'block';
        openSocket(location.host);
    });

});
