module.exports = Entity = extend(false, {
    init:function(id, type, x, y, hitRadius) {
        this.id = id;
        this.type = type;
        this.setPosition(x, y); 
        this.hitRadius = hitRadius;
    },

    getPosition:function() {
        return {
            x:this.x,
            y:this.y
        };
    },

    setPosition:function(x, y) {
        this.x = x;
        this.y = y;
    }
});
