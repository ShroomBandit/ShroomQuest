spider.define(function (require) {

    var Character   = require('./Character'),
        loader      = require('./loader'),
        map         = require('./map'),
        Sync        = require('../../shared/Sync'),
        utils       = require('./utils'),

        dialog      = document.getElementById('loginDialog'),
        loginButton = document.getElementById('login'),

        ent     = document.getElementById('entities'),
        bg      = document.getElementById('background'),
        entctx  = ent.getContext('2d'),
        bgctx   = bg.getContext('2d'),

        gameWindow = {
            x: ent.width,
            y: ent.height
        },
        model = {},
        players = {},

        loginData;

    function printWorldList(list) {
        var fragment = document.createDocumentFragment(),
            selectElement = document.getElementById('worldList');

        list.forEach(function (world) {
            var option = document.createElement('option'),
                text = world.id;

            if (world.isFull) {
                text += ' (full)';
                option.disabled = true;
            } else {
                option.value = world.id;
            }

            option.textContent = text;
            fragment.appendChild(option);
        });

        selectElement.innerHTML = '';
        selectElement.appendChild(fragment);
        loginButton.disabled = false;
    }

    function render() {
        // do not continue execution if the model has not been written yet
        var username = loginData.get().username;
        if (!(username in players)) {
            return false;
        }

        var me = players[username].getPosition();

        // redraw background
        map.draw(bgctx, me.x, me.y, loader.images.map);

        // redraw entities
        entctx.clearRect(0, 0, gameWindow.x, gameWindow.y);
        utils.framerate(entctx, gameWindow.x - 100, 20);
        players[username].draw(entctx, gameWindow.x/2, gameWindow.y/2, loader.images.character);

        for (var player in players) {
            if (player !== username) {
                players[player].draw(entctx, players[player].x - me.x + gameWindow.x/2, players[player].y - me.y + gameWindow.y/2, images.character);
            }
        }

        if ('projectiles' in model) {
            for (var i = 0; i < model.projectiles.length; i++) {
                entctx.fillStyle = 'rgba(0,0,0,1)';
                entctx.beginPath();
                entctx.arc(model.projectiles[i].x - me.x + gameWindow.x/2, model.projectiles[i].y - me.y + gameWindow.y/2, model.projectiles[i].radius, 0, Math.PI*2, false);
                entctx.closePath();
                entctx.fill();
            }
        }

        map.minimap(entctx, model.players);
    }

    function step() {
        render();
        requestAnimationFrame(step);
    }

    worldEvents = {
        death: location.reload,
        player: function (data) {
            players[data.username].updateAttributes(data.attributes);
        },
        projectiles: function (data) {
            model.projectiles = data;
        }
    };

    ent.width = gameWindow.x;
    ent.height = gameWindow.y;
    bg.width = gameWindow.x;
    bg.height = gameWindow.y;

    Sync.init(window.location.host);

    Sync.create('worldList').change(printWorldList);

    Sync.create('port').change(function (port) {
        Sync.init(window.location.hostname + ':' + port);
        dialog.style.display = 'none';
        loader.loadImages(function () {
            players[loginData.get().username] = Character.create(1000, 1000);
            document.getElementById('gameWrapper').style.display = 'block';
            map.config(gameWindow);
            //ui.init(ent.clientLeft + gameWindow.x/2, ent.clientTop + gameWindow.y/2, data.width, data.height);
            step();
        });
    });

    Sync.create('loginStatus').change(function (status) {
        console.log('login: ' + status);
    });

    loginData = Sync.create('loginData');

    loginButton.addEventListener('click', function() {
        loginData.set({
            username:   dialog.elements.username.value,
            world:      dialog.elements.worldList.value
        });
    });
});
