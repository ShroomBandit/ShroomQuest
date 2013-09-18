module.exports = Entity = extend(false, {
    init:function(x, y, type, id) {
        this.setPosition(x, y); 
        this.type = type;
        this.id = id;
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
