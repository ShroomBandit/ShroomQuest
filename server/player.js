var extend = require('./extend'),
    Character = require('./character');
    
module.exports = Player = extend(Character, {
    init:function(id, server, connection) {
        var self = this;
        this.id = id;
        this.server = server;
        this.connection = connection;

        this.chatQueue = [];
        this.keys = {
            'w':false,
            'a':false,
            's':false,
            'd':false
        };
        this.velocity = 100;

        this.connection.on('message', function(raw) {
            var msg = JSON.parse(raw),
                data = msg.data,
                event = msg.event;
            console.log(msg);
            if(typeof self.username === 'undefined' && event !== 'login') {
                self.connection.send(JSON.stringify({
                    event:'loginfirst'
                }));
                self.server.removePlayer(this.id);
            };
            switch(event) {
                case 'login':
                    self.username = data;
                    // normally load position from database...
                    var x = 1000, y = 1000;
                    Character.call(self, self.id, 'player', x, y);
                    // normally load map from json file...
                    self.connection.send(JSON.stringify({
                        event:'loadGameData',
                        data:self.server.map
                    }));
                    break;
                case 'chat':
                    self.chatQueue.push(data);
                    break;
                case 'keydown':
                    self.keys[data] = true;
                    break;
                case 'keyup':
                    self.keys[data] = false;
                    break;
                case 'leftmousedown':
                    // in the future, get data from active spell
                    var pos = self.getPosition();
                    self.server.addProjectile(pos.x, pos.y, pos.x+data.x, pos.y+data.y, 200);
                    break;
                case 'leftmouseup':
                    break;
                case 'rightclick':
                    break;
            };
        });
        this.connection.on('close', function() {
            // save data to database
        });
    },

    emptyChatQueue:function() {
        if(this.chatQueue.length > 0) {
            var temp = this.chatQueue;
            this.chatQueue = [];
            return temp;
        }else{
            return false;
        };
    },

    updatePosition:function(timeDelta) {
        var distance = Math.round((((this.keys.w || this.keys.s) && (this.keys.a && this.keys.d)) ?
            this.velocity*Math.sqrt(2) : this.velocity) * timeDelta);
        if(this.keys.w) {
            this.y -= distance;
        };
        if(this.keys.a) {
            this.x -= distance;
        };
        if(this.keys.s) {
            this.y += distance;
        };
        if(this.keys.d) {
            this.x += distance;
        };
    }
});
