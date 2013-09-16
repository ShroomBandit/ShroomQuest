var extend = require('./extend'),
    Character = require('./character');
    
module.exports = Player = extend(Character, {
    playerInit:function(ws) {
        var self = this;
        this.ws = ws;
        this.ws.on('message', function(raw) {
            var msg = JSON.parse(raw),
                data = msg.data,
                event = msg.event;
            if(typeof self.username !== 'undefined' || event === 'login') {
                // this.ws.close()  ???
            };
            if(event === 'login') {
                self.username = data;
                // normally load position from database...
                var x = 1000, y = 1000;
                self.characterInit.call(self, x, y, 'player', self.username);
                // normally load map from json file...
                var map = require('./map'),
                    width = 10000, height = 10000, tilesize = 40,
                    tiles = map.generate(width/tilesize, height/tilesize);
                self.ws.send(JSON.stringify({
                    event:'loadGameData',
                    data:{
                        width:width,
                        height:height,
                        tiles:tiles,
                        tilesize:tilesize
                    }
                }));
            }else if(event === 'move') {
                self.setPosition(data.x, data.y);
            };
        });
        this.ws.on('close', function() {
            // save data to database
        });
    }
});
