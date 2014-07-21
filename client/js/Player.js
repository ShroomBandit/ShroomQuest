spider.define(function (require) {

    var Character   = require('./Character'),
        Sync        = require('Sync');

    return Character.extend({

        create:function(x, y) {
            var self = Character.create.call(this, x, y);
            self.x = Sync.create('x');
            self.y = Sync.create('y');
            return self;
        },

        getPosition: function () {
            return {
                x: this.x.get(),
                y: this.y.get()
            }
        }

    });

});
