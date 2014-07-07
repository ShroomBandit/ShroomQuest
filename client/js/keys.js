spider.define(function (require) {
    
    var chat    = require('./ui/chat'),
        Sync    = require('Sync'),
        ui      = require('./ui/main'),
    
        // key event vars
        keymap = {
            '87':'w',
            '65':'a',
            '83':'s',
            '68':'d',
            '16':'shift',
            '13':'enter',
            '48':0,
            '49':1,
            '50':2,
            '51':3,
            '52':4,
            '53':5,
            '54':6,
            '55':7,
            '56':8,
            '57':9
        },
        pressed = {};
    
    function init() {
        for (var keyCode in keymap) {
            if (isMovementKey(keymap[keyCode])) {
                pressed[keymap[keyCode]] = Sync.create(keymap[keyCode], false);
            }
        }
        addKeyEventListeners();
    }

    function addKeyEventListeners() {
        document.addEventListener('keydown', function (event){
            if (event.keyCode in keymap) {
                var key = keymap[event.keyCode];

                // The enter key will trigger the chat window.
                if (key === 'enter') {
                    event.preventDefault();
                    chat.use();
                } else if (!chat.isChatting()) {
                    handleKey(key, true);
                }
            }
        });

        document.addEventListener('keyup', function (event){
            // Disregard keyup events when chatting.
            if (event.keyCode in keymap && !chat.isChatting()) {
                var key = keymap[event.keyCode];
                
                handleKey(key, false);
            }
        });
    }
    
    function handleKey(key, isDown) {
        if (isMovementKey(key)) {
            pressed[key].set(isDown);
        } else if (typeof key === 'number') {
            ui.selectSkill(key);
        } else {
            // TODO: Handle shift and enter.
        }
    }
    
    function isMovementKey(key) {
        return 'wasd'.indexOf(key) !== -1;
    }
    
    return {
        init: init
    }

});
