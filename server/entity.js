var Entity = function() {};

Entity.prototype = {
    entityInit:function(x, y, type, id) {
        this.setPosition(x, y); 
        this.type = type;
        this.id = id;
    },
    setPosition:function(x, y) {
        this.x = x;
        this.y = y;
    }
};

module.exports = Entity;
