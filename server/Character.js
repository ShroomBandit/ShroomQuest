var Entity = require('./Entity');

module.exports = Entity.extend({

    create: function (id, type, x, y) {
        var self = Entity.create.call(this, id, type, x, y, 10);
        return self;
    },

    setTarget: function (id) {
        this.target = id;
    }

});
