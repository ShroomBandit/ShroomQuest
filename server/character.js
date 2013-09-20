var extend = require('./extend'),
    Entity = require('./entity');

module.exports = Character = extend(Entity, {
    init:function(id, type, x, y) {
        Entity.call(this, id, type, x, y);
    },

    setTarget:function(id) {
        this.target = id;
    }
});
