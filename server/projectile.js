var extend = require('./extend'),
    Entity = require('./entity');

module.exports = Projectile = extend(Entity, {
    init:function(id, owner, startX, startY, destX, destY, velocity, damage) {
        Entity.call(this, id, 'projectile', startX, startY, 3);
        this.owner = owner;
        this.destX = destX;
        this.destY = destY;
        this.startX = startX;
        this.startY = startY;
        this.calculateVelocity(velocity);
        this.damage = damage;
    },

    calculateVelocity:function(velocity) {
        var lengthX = this.destX - this.startX,
            lengthY = this.destY - this.startY;
        // angle is calculated from positive x axis moving counterclockwise
        var angle = Math.atan(lengthY/lengthX);
        if(lengthX < 0) {
            angle += Math.PI;
        };
        this.velocityX = Math.round(velocity*Math.cos(angle));
        this.velocityY = Math.round(velocity*Math.sin(angle));
    },

    updatePosition:function(timeDelta) {
        var newX = Math.round(this.x + this.velocityX * timeDelta),
            newY = Math.round(this.y + this.velocityY * timeDelta);
        if((Math.abs(newX - this.destX) < Math.abs(this.x - this.destX)) ||
            (Math.abs(newY - this.destY) < Math.abs(this.y - this.destY))) {
            this.setPosition(newX, newY);
        }else{
            this.setPosition(this.destX, this.destY);
        };
    }
});
