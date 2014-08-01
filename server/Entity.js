'use strict';

var Extendable = require('../shared/Extendable');

/** @class Entity */
module.exports = Extendable.extend(/** @lends Entity.prototype */{

    /**
     * Create a new entity.
     * @param {number} id - The id number of the entity
     * @param {string} type - I do not remember what this is for.
     * @param {number} x - The starting x coordinate of the entity
     * @param {number} y - The starting y coordinate of the entity
     * @param {number} hitRaidus - The distance at which to fire collisions with other entities
     * @return {object} The created character
     */
    create: function (id, type, x, y, hitRadius) {
        var self = Object.create(this);
        self.id = id;
        self.type = type;
        self.setPosition(x, y);
        self.hitRadius = hitRadius;
        return self;
    },

    getPosition: function () {
        return {
            x: this.x,
            y: this.y
        }
    },

    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
    }

});
