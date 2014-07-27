spider.alias('../../shared/Sync', 'Sync');
spider.alias('../../shared/Extendable', 'Extendable');

spider.define(function (require) {

    var Character   = require('./Character'),
        keys        = require('./keys'),
        loader      = require('./loader'),
        map         = require('./map'),
        mouse       = require('./mouse'),
        Player      = require('./Player'),
        Sync        = require('Sync'),
        ui          = require('./ui/main'),
        utils       = require('./utils'),

        dialog      = document.getElementById('loginDialog'),
        loginButton = document.getElementById('login'),
        progressBar = document.getElementById('progressBar'),

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

        isPaused = false,

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
            return;
        }

        var me = players[username].getPosition();
        if (me.x === undefined || me.y === undefined) {
            return;
        }

        // redraw background
        map.draw(bgctx, me.x, me.y, loader.images.map);

        // redraw entities
        entctx.clearRect(0, 0, gameWindow.x, gameWindow.y);
        utils.framerate(entctx, gameWindow.x - 100, 20);
        players[username].draw(entctx, gameWindow.x/2, gameWindow.y/2, loader.images.character);

        /*
         * TODO: Add these parts back piece by piece.
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
        */
    }

    function pause() {
        isPaused = true;
    }

    function step() {
        if (isPaused !== true) {
            render();
        }
        requestAnimationFrame(step);
        //setTimeout(step, 500);
    }

    window.pause = pause;

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
    progressBar.style.marginTop = gameWindow.y/2 + 'px';

    Sync.create('worldList', [], {watch: true, silently: true}).on('change', printWorldList);

    Sync.create('port', undefined, {watch: true, silently: true}).on('change', function (port) {
        Sync.init(window.location.hostname + ':' + port);
        dialog.style.display = 'none';
        progressBar.style.display = 'block';
        loader.start(function (progress) {
            progressBar.value = progress;
        }, function () {
            players[loginData.get().username] = Player.create(1000, 1000);
            progressBar.style.display = 'none';
            document.getElementById('gameWrapper').style.display = 'block';
            map.config(gameWindow.x, gameWindow.y);
            ui.init();
            mouse.config(ent.clientLeft + gameWindow.x/2, ent.clientTop + gameWindow.y/2)
            keys.init();
            step();
        });
    });

    Sync.create('loginStatus', '', {watch: true, silently: true}).on('change', function (status) {
        console.log('login: ' + status);
    });

    loginData = Sync.create('loginData');

    loginButton.addEventListener('click', function() {
        loginData.set({
            username:   dialog.elements.username.value,
            world:      dialog.elements.worldList.value
        });
    });

    Sync.init(window.location.host);
});
