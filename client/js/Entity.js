spider.define(function (require) {

    var Extendable  = require('Extendable'),
        Sync    = require('Sync');

    return Extendable.extend({

        create: function (id) {
            var self = Object.create(this);
            self.id = id;
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
