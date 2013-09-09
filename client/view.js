module.define('view', function() {

    var character = module.import('view/character'),
        map = module.import('view/map'),
        minimap = module.import('view/minimap'),
        model = module.import('model'),
        mouse = module.import('view/mouse'),
        utils = module.import('view/utils'),
        skills = module.import('view/skills'),

        canvas = document.getElementById('c'),
        ctx = canvas.getContext('2d'),
        gameWindow = {
            x:1000,
            y:600
        },

    resizeCanvas = function() {
        canvas.width = gameWindow.x;
        canvas.height = gameWindow.y;
    };
    
    model.colors = {
        black:'rgba(0,0,0,1)',
        lightgray:'rgba(200,200,200,1)',
        white:'rgba(255,255,255,1)'
    };

    return {
        draw:function(delta) {
            map.draw(ctx, model.me.x, model.me.y);
            //minimap.draw(ctx);
            utils.framerate(ctx, gameWindow.y - 30, 20, delta);
            //skills.draw(ctx);
            character.draw(ctx, gameWindow.x/2, gameWindow.y/2);
            for(var player in model.players) {
                if(player !== model.username) {
                    character.draw(ctx, model.players[player].x - model.me.x + gameWindow.x/2, model.players[player].y - model.me.y + gameWindow.y/2);
                };
            };
            mouse.draw(ctx);
        },
        initialize:function() {
            resizeCanvas();
            map.initialize(10000, 5000, gameWindow.x, gameWindow.y);
            mouse.initialize();
        }
    };

});
