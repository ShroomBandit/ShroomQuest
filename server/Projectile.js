/**
 * @module
 * @extends module:server/Entity
 */

'use strict';

var Entity = require('./Entity');

module.exports = Entity.extend({

    /**
     * @param {number} id
     * @param {number} owner - The id of the projectile's owner entity
     * @param {number} startX
     * @param {number} startY
     * @param {number} destX
     * @param {number} destY
     * @param {number} velocity
     * @param {number} radius
     * @param {number} damage
     */
    create: function (id, owner, startX, startY, destX, destY, velocity, radius, damage) {
        var self = Entity.create.call(this, id, 'projectile', startX, startY, radius);
        self.owner = owner;
        self.destX = destX;
        self.destY = destY;
        self.calculateVelocityComponents(velocity);
        self.damage = damage;
        return self;
    },

    /**
     * Set the x and y velocity components of the projectile.
     * This is called once at the projectile's creation.
     * @param {number} velocity - The magnitude of the velocity vector
     */
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

    /**
     * @param {number} timeDelta
     */
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
