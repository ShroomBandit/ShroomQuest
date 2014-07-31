spider.define(function (require) {

    var Character   = require('./Character'),
        keys        = require('./keys'),
        mouse       = require('./mouse'),
        Sync        = require('Sync');
        
    function createKeys() {
        var movementKeys = {};
        ['w', 'a', 's', 'd'].forEach(function (key) {
            movementKeys[key] = Sync.create(key, false);
        });
        return movementKeys;
    }

    function assignMovementKeyHandlers() {
        var movementKeys = createKeys();

        function setMovementKey(key, isDown) {
            movementKeys[key].set(isDown);
        }

        ['moveUp', 'moveLeft', 'moveDown', 'moveRight'].forEach(function (action) {
            keys.on(action, setMovementKey);
        });
    }

    return Character.extend({

        create: function(id) {
            var self = Character.create.call(this, id);

            mouse.init(self.direction);
            assignMovementKeyHandlers();

            return self;
        }

    });

});
