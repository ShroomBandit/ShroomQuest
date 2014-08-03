/** @module */

'use strict';

var WorldServer = require('./WorldServer'),

    worlds = [];

/**
 * @param {number} worldId
 * @param {object} playerData
 * @param {string} ip
 */
function assignPlayer(worldId, playerData, ip) {
    var world = worlds[worldId];

    if (world === undefined || world === null || isWorldFull(world)) {
        return false;
    }

    if (!world.running) {
        world.start();
    }

    world.addPlayer(playerData, ip);
    return true;
}

function ensureOpenWorld() {
    var worldId = findOpenWorld();
    if (worldId === worlds.length) {
        // All the current worlds are full, so start a new one.
        worlds.push(WorldServer.create(worldId));
    }
}

function findOpenWorld() {
    var worldId = 0;
    if (worlds.length > 0) {
        while (isWorldFull(worlds[worldId])) {
            worldId++;
        }
    }
    return worldId;
}

/**
 * @param {number} id
 * @returns {object|null} The world instance or null if it does not exist
 */
function getWorld(id) {
    return (0 <= id && id < worlds.length && worlds[id] !== null) ? worlds[id] : null;
}

/**
 * @returns {array} An array of metadata for the current world instances
 */
function getWorldList() {
    ensureOpenWorld();

    return worlds.map(function (world) {
        return {
            id:     world.id,
            isFull: isWorldFull(world)
        }
    });
}

function isWorldFull(world) {
    return world.players.length > 10;
}

module.exports = {
    assignPlayer:   assignPlayer,
    getWorld:       getWorld,
    getWorldList:   getWorldList
}
