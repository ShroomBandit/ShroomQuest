module.define('input', function() {

    var init = function(ws) {
        ws.listen('players', function(data) {
            model.players = data;
        });
    };

    return {
        init:init
    };

});
