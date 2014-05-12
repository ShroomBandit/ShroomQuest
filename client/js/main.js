spider.define(function(require) {

    var Character = require('character'),
        map = require('map'),
        ui = require('ui'),
        utils = require('utils'),

        ent = document.getElementById('entities'),
        bg = document.getElementById('background'),
        entctx = ent.getContext('2d'),
        bgctx = bg.getContext('2d'),

        socket, username,
        gameWindow = {
            x:ent.width,
            y:ent.height
        },
        images = {},
        loadedImages = 0,
        model = {},
        players = {},

    checkImageLoad = function() {
        loadedImages++;
        if(loadedImages === 21) {
            players[username] = Character.create();
            players[username].x = 1000;
            players[username].y = 1000;
            step();
        };
    },

    loadImages = function() {
        images.map = {};
        for(var i = 0; i < 16; i++) {
            if(i !== 5 && i !== 10) {
                var bin = ('000' + i.toString(2)).slice(-4);
                images.map[bin] = new Image();
                images.map[bin].onload = checkImageLoad;
                images.map[bin].src = '/images/tiles/' + bin + '.png';
            };
        };
        images.character = {};
        images.character.body = new Image();
        images.character.body.onload = checkImageLoad;
        images.character.body.src = '/images/sprites/png/walkcycle/BODY_male.png';
        images.character.belt = new Image();
        images.character.belt.onload = checkImageLoad;
        images.character.belt.src = '/images/sprites/png/walkcycle/BELT_rope.png';
        images.character.torso = new Image();
        images.character.torso.onload = checkImageLoad;
        images.character.torso.src = '/images/sprites/png/walkcycle/TORSO_robe_shirt_brown.png';
        images.character.legs = new Image();
        images.character.legs.onload = checkImageLoad;
        images.character.legs.src = '/images/sprites/png/walkcycle/LEGS_robe_skirt.png';
        images.character.hair = new Image();
        images.character.hair.onload = checkImageLoad;
        images.character.hair.src = '/images/sprites/png/walkcycle/HEAD_hair_blonde.png';
        images.character.head = new Image();
        images.character.head.onload = checkImageLoad;
        images.character.head.src = '/images/sprites/png/walkcycle/HEAD_robe_hood.png';
        images.character.feet = new Image();
        images.character.feet.onload = checkImageLoad;
        images.character.feet.src = '/images/sprites/png/walkcycle/FEET_shoes_brown.png';
    },

    openSocket = function(ip) {
        socket = new WebSocket('ws://' + ip);
        socket.onopen = function() {
            console.log('Socket opened!');
            sendMessage('login', username);
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
                ui.addToChatHistory(data);
                break;
            case 'loadGameData':
                map.config(data, gameWindow.x, gameWindow.y);
                ui.init(sendMessage, gameWindow.x/2, gameWindow.y/2, data.width, data.height);
                loadImages();
                break;
            case 'player':
                players[data.username].updateAttributes(data.attributes);
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
        // do not continue execution if the model has not been written yet
        if(!(username in players)) return false;
        var me = players[username].getPosition();

        // redraw background
        map.draw(bgctx, me.x, me.y, images.map);

        // redraw entities
        entctx.clearRect(0, 0, gameWindow.x, gameWindow.y);
        utils.framerate(entctx, gameWindow.x - 100, 20);
        players[username].draw(entctx, gameWindow.x/2, gameWindow.y/2, images.character);
        for(var player in players) {
            if(player !== username) {
                players[player].draw(entctx, players[player].x - me.x + gameWindow.x/2, players[player].y - me.y + gameWindow.y/2, images.character);
            };
        };
        if('projectiles' in model) {
            for(var i = 0, ilen = model.projectiles.length; i < ilen; i++) {
                entctx.fillStyle = 'rgba(0,0,0,1)';
                entctx.beginPath();
                entctx.arc(model.projectiles[i].x - me.x + gameWindow.x/2, model.projectiles[i].y - me.y + gameWindow.y/2, model.projectiles[i].radius, 0, Math.PI*2, false);
                entctx.closePath();
                entctx.fill();
            };
        };
        map.minimap(entctx, model.players);
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
        username = document.getElementById('username').value;
        dialog.parentNode.removeChild(dialog);
        document.getElementById('foreground').style.display = 'block';
        openSocket(location.host);
    });

});
