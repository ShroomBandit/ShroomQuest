spider.define(function (require) {

    var Character = require('./Character');

    return Character.extend({

        create:function(x, y) {
            var self = Character.create.call(this, x, y);
            return self;
        }

    });

});
