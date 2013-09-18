var extend = require('./extend'),
    Character = require('./character');
    
module.exports = Player = extend(Character, {
    init:function(server, connection) {
        var self = this;
        this.server = server;
        this.connection = connection;

        this.keys = {
            'w':false,
            'a':false,
            's':false,
            'd':false
        };
        this.velocity = 5;

        this.connection.on('message', function(raw) {
            var msg = JSON.parse(raw),
                data = msg.data,
                event = msg.event;
            if(typeof self.username !== 'undefined' || event === 'login') {
                // this.connection.close()  ???
            };
            if(event === 'login') {
                self.username = data;
                // normally load position from database...
                var x = 1000, y = 1000;
                Character.call(self, x, y, 'player', self.username);
                // normally load map from json file...
                self.connection.send(JSON.stringify({
                    event:'loadGameData',
                    data:self.server.map
                }));
            }else if(event === 'keydown') {
                var pos = self.getPosition();
                self.keys[data] = true;
                if(self.keys.w) {
                    pos.y -= self.velocity;
                };
                if(self.keys.a) {
                    pos.x -= self.velocity;
                };
                if(self.keys.s) {
                    pos.y += self.velocity;
                };
                if(self.keys.d) {
                    pos.x += self.velocity;
                };
                self.setPosition(pos.x, pos.y);
            }else if(event === 'keyup') {
                self.keys[data] = false;
            };
        });
        this.connection.on('close', function() {
            // save data to database
        });
    }
});
