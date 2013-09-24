module.define('keys', function() {

    var model = module.import('model'),
    
    keymap = {
        '87':'w',
        '65':'a',
        '83':'s',
        '68':'d',
        '16':'shift',
        '49':'1',
        '50':'2',
        '51':'3',
        '52':'4',
        '53':'5',
        '54':'6',
        '55':'7',
        '56':'8',
        '57':'9'
    },

    pressed = {},

    init = function(send) {
        for(var key in keymap) {
            pressed[key] = false;
        };
        document.addEventListener('keydown', function(event){
            if(!model.chatting && event.keyCode in keymap && !pressed[event.keyCode]) {
                pressed[event.keyCode] = true;
                send('keydown', keymap[event.keyCode]);
            };
        });
        document.addEventListener('keyup', function(event){
            if(!model.chatting && event.keyCode in keymap) {
                pressed[event.keyCode] = false;
                send('keyup', keymap[event.keyCode]);
            };
        });
    };

    return {
        init:init
    };

});
