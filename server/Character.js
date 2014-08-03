/**
 * @module
 * @extends module:server/Entity
 */

'use strict';

var Entity = require('./Entity');

module.exports = Entity.extend({

    /**
     * Create a new character.
     * @see module:server/Entity#create
     * @param {number} id
     * @param {string} type
     * @param {number} x
     * @param {number} y
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
