var createSync      = require('../shared/Sync'),
    generateMap     = require('./generateMap'),
	Player          = require('./Player'),
    Projectile      = require('./Projectile'),
    WebSocketServer = require('./WebSocketServer');

module.exports = {

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
        self.updatesPerSecond = 60;

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

    addPlayer: function (playerData, ip) {
        // Store the ip address of the client,
        // and wait up to five seconds for it to open a socket to the game server.
        var id = this.getValidId(this.players),
            self = this;

        this.players[id] = 'staged';
        this.staged[ip] = {
            id:         id,
            playerData: playerData,
            timeout:    setTimeout(function () {
                self.players[id] = null;
                delete self.staged[ip];
            }, 5000)
        };
    },

    addProjectile: function (owner, startX, startY, destX, destY, velocity, radius, damage) {
        var id = this.getValidId(this.projectiles);
        //console.log('projectile '+id+' fired by player '+owner);
        this.projectiles[id] = Projectile.create(id, owner, startX, startY, destX, destY, velocity, radius, damage);
    },

    broadcastToWorld: function (message) {
        this.forEachEntity(this.players, function (player) {
            player.connection.send(message);
        });
    },

    forEachEntity: function (entityList, fn) {
        for (var i = 0; i < entityList.length; i++) {
            if (entityList[i]) {
                fn.call(this, entityList[i], i);
            }
        }
    },

    getValidId: function (entityList) {
        var ilen = entityList.length;
        for (var i = 0; i < ilen; i++) {
            if (entityList[i] === null) {
                return i;
            }
        }
        return ilen;
    },

    removePlayer: function (id) {
        this.players[id] = null;
    },

    removeProjectile: function (id) {
        this.projectiles[id] = null;
    },

    start: function () {
        var self = this,
            previous = Date.now();

        this.running = setInterval(function() {
            var current = Date.now();
            //self.update((current - previous) / 1000);
            previous = current;
        }, self.updatesPerSecond);
    },

    stop: function () {
        clearInterval(this.running);
        this.running = false;
    },

    testCollision: function (id1, id2) {
        var pos1 = id1.getPosition(),
            pos2 = id2.getPosition(),
            distance = Math.round(Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)));
        return (distance - id1.hitRadius - id2.hitRadius < 0) ? true : false;
    },

    update: function (timeDelta) {
        var self = this,
            changes = [],
            changeString;

        // Update all players and push changes.
        this.forEachEntity(this.players, function (player) {
            player.updatePosition(timeDelta);
            changes.push.apply(changes, player.Sync.flush({local: true}));
        });

        changeString = JSON.stringify(changes);
        this.forEachEntity(this.players, function (player) {
            player.Sync.send(changeString);
        });

        // update all projectiles
        /*this.forEachEntity(this.projectiles, function (projectile, i) {
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
        /*this.forEachEntity(this.players, function (player, i) {
            this.forEachEntity(this.projectiles, function (projectile, j) {
                var collision = this.testCollision(player, projectile);
                if (collision && i !== projectile.owner) {
                    player.registerHit(projectile);
                    this.removeProjectile(j);
                }
            });
        });*/
    }

}
