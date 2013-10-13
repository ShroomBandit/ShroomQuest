var extend = require('./extend'),
    Entity = require('./entity');

module.exports = Character = extend(Entity, {
    init:function(id, type, x, y) {
        Entity.call(this, id, type, x, y, 10);
        this.changes = {};
        this.direction = 3;
    },

    changeDirection:function(direction) {
        this.direction = direction;
        this.changes.direction = this.direction;
    },

    getChanges:function() {
        if(Object.keys(this.changes).length > 0) {
            var temp = this.changes;
            this.changes = {};
            return temp;
        }else{
            return false;
        };
    },

    setTarget:function(id) {
        this.target = id;
    }
});
