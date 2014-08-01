'use strict';

var Entity = require('./Entity');

/**
  * @class Character
  * @extends Entity
  */
module.exports = Entity.extend(/** @lends Character.prototype */{

    /**
     * Create a new character.
     * @param {number} id - The id number of the character
     * @param {string} type - I do not remember what this is for.
     * @param {number} x - The starting x coordinate of the character
     * @param {number} y - The starting y coordinate of the character
     * @return {object} The created character
     */
    create: function (id, type, x, y) {
        var self = Entity.create.call(this, id, type, x, y, 10);
        return self;
    },

    /**
     * Set the target of the character
     * @param {number} id - The id number of the target entity
     */
    setTarget: function (id) {
        this.target = id;
    }

});
