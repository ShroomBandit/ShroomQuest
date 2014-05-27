var WorldServer = require('./WorldServer'),

    worlds = [];

function assignPlayer(worldId, playerData, ip) {
    var world = worlds[worldId];

    if (world === null || isWorldFull(world)) {
        return false;
    }

    if (!world.running) {
        world.start();
    }

    world.addPlayer(playerData, ip);
    return true;
}

function ensureOpenWorld() {
    var i = 0;

    if (worlds.length > 0) {
        while (isWorldFull(worlds[i])) {
            i++;
        }
    }

    if (i === worlds.length) {
        // All the current worlds are full, so start a new one.
        worlds.push(WorldServer.create(i));
    }
}

function getWorld(id) {
    return (0 <= id && id < worlds.length && worlds[id] !== null) ? worlds[id] : null;
}

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

module.exports.assignPlayer = assignPlayer;
module.exports.getWorld = getWorld;
module.exports.getWorldList = getWorldList;
