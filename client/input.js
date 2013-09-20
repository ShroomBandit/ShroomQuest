module.define('input', function() {

    var model = module.import('model');

    init = function(ws) {
        ws.listen('players', function(data) {
            model.players = data;
        });

        ws.listen('projectiles', function(data) {
            model.projectiles = data;
        });
    };

    return {
        init:init
    };

});
