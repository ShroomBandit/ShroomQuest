var generateMap = require('./generateMap'),
	Player = require('./player'),
    Projectile = require('./projectile');

module.exports = WorldServer = extend(false, {
    init:function(id, webSocketServer) {
        this.id = id;
        this.server = webSocketServer;

        // a temporary measure until we code individual maps
        this.map = {
            width:10000,
            height:10000,
            tilesize:40
        };
        this.map.tiles = generateMap(this.map.width/this.map.tilesize, this.map.height/this.map.tilesize)

        this.updatesPerSecond = 60;
        this.players = [];
        this.projectiles = [];
        this.running = false;
    },

    addPlayer:function(connection) {
        var id = this.getValidId(this.players);
        this.players[id] = new Player(id, this, connection);
    },

    addProjectile:function(owner, startX, startY, destX, destY, velocity, radius, damage) {
        var id = this.getValidId(this.projectiles);
        console.log('projectile '+id+' fired by player '+owner);
        this.projectiles[id] = new Projectile(id, owner, startX, startY, destX, destY, velocity, radius, damage);
    },

    broadcastToWorld:function(message) {
        this.forEachEntity(this.players, function(player) {
            player.connection.send(message);
        });
    },

    forEachEntity:function(entityList, fn) {
        for(var i = 0, ilen = entityList.length; i < ilen; i++) {
            if(entityList[i]) {
                fn.call(this, entityList[i], i);
            };
        };
    },

    getValidId:function(entityList) {
        var ilen = entityList.length;
        for(var i = 0; i < ilen; i++) {
            if(!entityList[i]) {
                return i;
            };
        };
        return ilen;
    },

    removePlayer:function(id) {
        this.players[id] = false;
    },

    removeProjectile:function(id) {
        this.projectiles[id] = false;
    },

    start:function() {
        var self = this;
        var previous = Date.now();
        this.running = setInterval(function() {
            var current = Date.now();
            self.update.call(self, (current-previous)/1000);
            previous = current;
        }, self.updatesPerSecond);
    },

    stop:function() {
        clearInterval(this.running);
        this.running = false;
    },

    testCollision:function(id1, id2) {
        var pos1 = id1.getPosition(),
            pos2 = id2.getPosition(),
            distance = Math.round(Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)));
        return (distance - id1.hitRadius - id2.hitRadius < 0) ? true : false;
    },

    update:function(timeDelta) {
        var self = this;
        // The events array is an array of objects, where each object
        // contains and event and its corresponding data to be broadcasted
        // to all the clients (players).
        var events = [];

        // check for player updates
        var playerData = {};
        this.forEachEntity(this.players, function(player) {
            player.updatePosition(timeDelta);
            playerData[player.username] = player.getPosition();
            // check for messages
            var messages = player.emptyChatQueue();
            if(messages) {
                events.push({
                    event:'chat',
                    data:messages
                });
            };
        });
        events.push({
            event:'players',
            data:playerData
        });

        // update all projectiles
        var projData = [];
        this.forEachEntity(this.projectiles, function(projectile, i) {
            if(projectile.x === projectile.destX && projectile.y === projectile.destY) {
                this.removeProjectile(i);
            }else{
                projectile.updatePosition(timeDelta);
                var temp = projectile.getPosition();
                temp.radius = projectile.hitRadius;
                projData.push(temp);
            };
        });
        if(projData.length > 0) {
            events.push({
                event:'projectiles',
                data:projData
            });
        };

        // test for collisions
        this.forEachEntity(this.players, function(player, i) {
            this.forEachEntity(this.projectiles, function(projectile, j) {
                var collision = this.testCollision(player, projectile);
                if(collision && i !== projectile.owner) {
                    player.registerHit(projectile);
                    this.removeProjectile(j);
                };
            });
        });

        // broadcast if necessary
        if(events.length > 0) {
            this.broadcastToWorld(JSON.stringify(events));
        };
    }
});
