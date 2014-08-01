'use strict';

var Entity = require('./Entity');

/**
 * @class Projectile
 * @extends Entity
 */
module.exports = Entity.extend(/** @lends Projectile.prototype */{

    create: function (id, owner, startX, startY, destX, destY, velocity, radius, damage) {
        var self = Entity.create.call(this, id, 'projectile', startX, startY, radius);
        self.owner = owner;
        self.destX = destX;
        self.destY = destY;
        self.calculateVelocityComponents(velocity);
        self.damage = damage;
        return self;
    },

    calculateVelocityComponents: function (velocity) {
        var lengthX = this.destX - this.x,
            lengthY = this.destY - this.y,
            angle = Math.atan(lengthY/lengthX);
        // angle is calculated from positive x axis moving counterclockwise
        if(lengthX < 0) {
            angle += Math.PI;
        };
        this.velocityX = Math.round(velocity*Math.cos(angle));
        this.velocityY = Math.round(velocity*Math.sin(angle));
    },

    updatePosition: function (timeDelta) {
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
