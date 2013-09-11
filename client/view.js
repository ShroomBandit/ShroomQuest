module.define('view', function() {

    var character = module.import('view/character'),
        map = module.import('view/map'),
        model = module.import('model'),
        ui = module.import('view/ui'),
        utils = module.import('view/utils'),

        canvas = document.getElementById('c'),
        ctx = canvas.getContext('2d'),
        gameWindow = {
            x:1000,
            y:600
        },

    init = function(data, callback) {
        canvas.width = gameWindow.x;
        canvas.height = gameWindow.y;
        model.players = {};
        model.players[model.username] = {
            x:data.width/2,
            y:data.height/2
        };
        map.config(data, gameWindow.x, gameWindow.y);
        map.loadTiles(callback);
    },

    render = function() {
        map.draw(ctx, model.players[model.username].x, model.players[model.username].y);
        utils.framerate(ctx, gameWindow.x - 100, 20);
        character.draw(ctx, gameWindow.x/2, gameWindow.y/2);
        for(var player in model.players) {
            if(player !== model.username) {
                character.draw(ctx, model.players[player].x - model.me.x + gameWindow.x/2, model.players[player].y - model.me.y + gameWindow.y/2);
            };
        };
    };

    return {
        init:init,
        render:render
    };

});
