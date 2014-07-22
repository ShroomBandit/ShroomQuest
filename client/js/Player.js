spider.define(function (require) {

    var Character   = require('./Character'),
        mouse       = require('./mouse'),
        Sync        = require('Sync');

    return Character.extend({

        create: function(id) {
            var self = Character.create.call(this, id);
            mouse.init(self.direction);
            return self;
        }

    });

});
