var chat = require('./chat'),
    generateMap = require('./generateMap'),
	Player = require('./player');

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

        this.players = [];
        this.running = false;
    },

    broadcastToWorld:function(message) {
        for(var i = 0, ilen = this.players.length; i < ilen; i++) {
            this.players[i].connection.send(message);
        };
    },

    playerConnect:function(connection) {
        var id = this.players.length;
        this.players[id] = new Player(this, connection);
    },

    start:function() {
        var self = this;
        this.running = setInterval(function() {
            self.update.call(self)
        }, 100);
    },

    stop:function() {
        clearInterval(this.running);
        this.running = false;
    },

    update:function() {
        // The events array is an array of objects, where each object
        // contains and event and its corresponding data to be broadcasted
        // to all the clients (players).
        var events = [];
        // check for messages and prepare for broadcast
        var messages = chat.getAll();
        if(messages) {
            events.push({
                event:'chat',
                data:messages
            });
        };
        // check for player updates and prepare for broadcast
        var playerData = {};
        for(var i = 0, ilen = this.players.length; i < ilen; i++) {
            playerData[this.players[i].username] = this.players[i].getPosition();
        };
        events.push({
            event:'position',
            data:playerData
        });
        if(events.length > 0) {
            this.broadcastToWorld(JSON.stringify(events));
        };
    }
});
