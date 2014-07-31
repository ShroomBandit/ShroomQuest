spider.define(function (require) {
    'use strict';
    
    var EventEmitter    = require('EventEmitter'),
        Extendable      = require('Extendable'),
        keybindings     = require('./keybindings'),
    
        exports,
        messenger = Extendable.extend(EventEmitter),

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
        
        modes = ['normal', 'bypass'],
        mode = modes[0];
    
    function emitKeyEvent(isDown, event) {
        var key = keymap[event.keyCode];
        if (key !== undefined && key in keybindings) {
            exports.emit(keybindings[key], key, isDown, event);
        }
    }

    function handleKey(isDown, event) {
        switch (mode) {
            case 'normal': emitKeyEvent(isDown, event); break;
            default: break;
        }
    }
    
    function setMode(newMode) {
        if (modes.indexOf(newMode) !== -1) {
            mode = newMode;
        } else {
            throw new Error('Invalid mode: ' + newMode);
        }
    }

    document.addEventListener('keydown', handleKey.bind(null, true));
    document.addEventListener('keyup', handleKey.bind(null, false));

    exports = messenger.extend({
        setMode: setMode
    });

    return exports;

});
