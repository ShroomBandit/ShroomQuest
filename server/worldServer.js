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
        var id = this.players.length;
        this.players[id] = new Player(id, this, connection);
    },

    addProjectile:function(startX, startY, destX, destY, velocity) {
        var id = this.projectiles.length;
        this.projectiles[id] = new Projectile(id, startX, startY, destX, destY, velocity);
    },

    broadcastToWorld:function(message) {
        for(var i = 0, ilen = this.players.length; i < ilen; i++) {
            this.players[i].connection.send(message);
        };
    },

    removePlayer:function(id) {
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

    update:function(timeDelta) {
        var self = this;
        // The events array is an array of objects, where each object
        // contains and event and its corresponding data to be broadcasted
        // to all the clients (players).
        var events = [];

        // check for player updates
        var playerData = {};
        for(var i = 0, ilen = this.players.length; i < ilen; i++) {
            this.players[i].updatePosition(timeDelta);
            playerData[this.players[i].username] = this.players[i].getPosition();
            // check for messages
            var messages = this.players[i].emptyChatQueue();
            if(messages) {
                events.push({
                    event:'chat',
                    data:messages
                });
            };
        };
        events.push({
            event:'players',
            data:playerData
        });

        // update all projectiles
        var projData = [];
        for(var i = 0, ilen = this.projectiles.length; i < ilen; i++) {
            this.projectiles[i].updatePosition(timeDelta);
            projData.push(this.projectiles[i].getPosition());
        };
        if(projData.length > 0) {
            events.push({
                event:'projectiles',
                data:projData
            });
        };

        // broadcast if necessary
        if(events.length > 0) {
            this.broadcastToWorld(JSON.stringify(events));
        };
    }
});
