/** @module */

'use strict';

var createSync      = require('../shared/Sync'),
    generateMap     = require('./generateMap'),
	Player          = require('./Player'),
    Projectile      = require('./Projectile'),
    WebSocketServer = require('./WebSocketServer');

module.exports = {

    /**
     * Create a new world server.
     * @param {number} id
     * @returns {object}
     */
    create: function (id) {
        var self = Object.create(this);

        self.id = id;
        self.server = WebSocketServer.create({port: 8081 + id});

        // a temporary measure until we code individual maps
        self.map = {
            width:10000,
            height:10000,
            tilesize:40
        };
        self.map.tiles = generateMap(self.map.width/self.map.tilesize, self.map.height/self.map.tilesize)

        self.players = [];
        self.projectiles = [];
        self.running = false;
        self.staged = {};
        self.updatesPerSecond = 30;

        self.server.on('connection', function (socket) {
            var data, Sync,
                ip = socket.upgradeReq.connection.remoteAddress;

            if (ip in self.staged) {
                data = self.staged[ip];
                clearTimeout(data.timeout);

                Sync = createSync(socket, {stage: true});
                Sync.create('map', self.map);
                Sync.flush();

                self.players[data.id] = Player.create(data.id, data.playerData, self, Sync);
                delete self.staged[ip];
            } else {
                socket.close();
            }
        });

        return self;
    },

    /**
     * Stores the ip address of the client,
     * and waits up to five seconds for it to open a socket to the game server.
     * @param {object} playerData
     * @param {string} ip
     */
    addPlayer: function (playerData, ip) {
        var id = this.getValidId('players'),
            self = this;

        this.players[id] = false;
        this.staged[ip] = {
            id:         id,
            playerData: playerData,
            timeout:    setTimeout(function () {
                self.players[id] = null;
                delete self.staged[ip];
            }, 5000)
        };
    },

    /**
     * @see module:server/Entity~create
     * @param {number} owner - The id of the projectile's owner entity
     * @param {number} startX
     * @param {number} startY
     * @param {number} destX
     * @param {number} destY
     * @param {number} velocity
     * @param {number} radius
     * @param {number} damage
     */
    addProjectile: function (owner, startX, startY, destX, destY, velocity, radius, damage) {
        var id = this.getValidId('projectiles');
        //console.log('projectile '+id+' fired by player '+owner);
        this.projectiles[id] = Projectile.create(id, owner, startX, startY, destX, destY, velocity, radius, damage);
    },

    /**
     * @param {string} message
     */
    broadcastToWorld: function (message) {
        this.forEachEntity('players', function (player) {
            player.connection.send(message);
        });
    },

    /**
     * Iterate through a list of entities bound to the server.
     * Provides a small for loop wrapper for convenience,
     * since an entity will be false if it has been deleted
     * and that id has not yet been reused.
     * I.e., checking the existence of each entity is done before calling fn.
     * @param {string} entityName - The name of the list of entities over which to iterate (plural)
     * @param {function} fn - The function to call for each entity
     */
    forEachEntity: function (entityName, fn) {
        var self = this;
        this[entityName].forEach(function (element, i) {
            if (element) {
                fn.call(self, element, i);
            }
        });
    },

    /**
     * Get the first valid id number of an entity list.
     * @param {string} entityName - The name of the list of entities to find an id in.
     * @returns {number} id
     */
    getValidId: function (entityName) {
        var i = 0;
        while(this[entityName][i]) {
            i++;
        }
        return i;
    },

    /**
     * Remove a player from the world.
     * @param {number} id
     */
    removePlayer: function (id) {
        this.players[id] = null;
    },

    /**
     * Remove a projectile from the world.
     * @param {number} id
     */
    removeProjectile: function (id) {
        this.projectiles[id] = null;
    },

    /**
     * Start the server, sending updates with the configured frequency.
     * @see updatesPerSecond
     */
    start: function () {
        var self = this,
            previous = Date.now();

        this.running = setInterval(function() {
            var current = Date.now();
            self.update((current - previous) / 1000);
            previous = current;
        }, 1000 / self.updatesPerSecond);
    },

    /**
     * Stop the server.
     */
    stop: function () {
        clearInterval(this.running);
        this.running = false;
    },

    /**
     * Test for a collistion between two entities.
     * @param {number} entity1
     * @param {number} entity2
     * @returns {boolean}
     */
    testCollision: function (entity1, entity2) {
        var pos1 = entity1.getPosition(),
            pos2 = entity2.getPosition(),
            distance = Math.round(Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)));
        return (distance - entity1.hitRadius - entity2.hitRadius < 0) ? true : false;
    },

    /**
     * This is the main game loop,
     * which is controlled by the start and stop methods.
     * @param {number} timeDelta - The time (in ms) that has passed since the last call to this method.
     */
    update: function (timeDelta) {
        var self = this,
            changes = [],
            changeString;

        // Update all players and push changes.
        this.forEachEntity('players', function (player) {
            player.updatePosition(timeDelta);
            changes.push.apply(changes, player.Sync.flush({local: true}));
        });

        changeString = JSON.stringify(changes);
        this.forEachEntity('players', function (player) {
            player.Sync.send(changeString);
        });

        // update all projectiles
        /*this.forEachEntity('projectiles', function (projectile, i) {
            var temp;
            if (projectile.x === projectile.destX && projectile.y === projectile.destY) {
                this.removeProjectile(i);
            } else {
                projectile.updatePosition(timeDelta);
                temp = projectile.getPosition();
                temp.radius = projectile.hitRadius;
                projData.push(temp);
            }
        });

        if (projData.length > 0) {
            events.push({
                event:  'projectiles',
                data:   projData
            });
        }*/

        // test for collisions
        /*this.forEachEntity('players', function (player, i) {
            this.forEachEntity('projectiles', function (projectile, j) {
                var collision = this.testCollision(player, projectile);
                if (collision && i !== projectile.owner) {
                    player.registerHit(projectile);
                    this.removeProjectile(j);
                }
            });
        });*/
    }

}
