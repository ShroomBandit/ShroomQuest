var Entity = require('./Entity');

module.exports = Entity.extend({

    create: function (id, type, x, y) {
        var self = Entity.create.call(this, id, type, x, y, 10);
        self.changes = {};
        self.direction = 3;
        return self;
    },

    changeDirection: function (direction) {
        this.direction = direction;
        this.changes.direction = this.direction;
    },

    getChanges: function () {
        if (Object.keys(this.changes).length > 0) {
            var temp = this.changes;
            this.changes = {};
            return temp;
        } else {
            return false;
        }
    },

    setTarget: function (id) {
        this.target = id;
    }

});
