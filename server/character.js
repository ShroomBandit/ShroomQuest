var extend = require('./extend'),
    Entity = require('./entity');

module.exports = Character = extend(Entity, {
    characterInit:function(x, y, type, id) {
        this.entityInit.call(this, x, y, type, id);
    }
});
