/** 
  * @module
  * @extends module:shared/Extendable
  */

'use strict';

var Extendable = require('../shared/Extendable');

module.exports = Extendable.extend({

    /**
     * Create a new entity.
     * @param {number} id - The id number of the entity
     * @param {string} type - I do not remember what this is for.
     * @param {number} x - The starting x coordinate of the entity
     * @param {number} y - The starting y coordinate of the entity
     * @param {number} hitRaidus - The distance at which to fire collisions with other entities
     * @returns {object} The created entity
     */
    create: function (id, type, x, y, hitRadius) {
        var self = Object.create(this);
        self.id = id;
        self.type = type;
        self.setPosition(x, y);
        self.hitRadius = hitRadius;
        return self;
    },

    /**
     * Get the position of the entity.
     * @returns {object} A singleton with the x and y coordinates
     */
    getPosition: function () {
        return {
            x: this.x,
            y: this.y
        }
    },

    /**
     * Set the position of the entity.
     * @param {number} x - The new x coordinate of the entity
     * @param {number} y - The new y coordinate of the entity
     */
    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
    }

});
