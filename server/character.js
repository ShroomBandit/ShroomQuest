var extend = require('./extend'),
    Entity = require('./entity');

module.exports = Character = extend(Entity, {
    init:function(x, y, type, id) {
        Entity.call(this, x, y, type, id);
    }
});
