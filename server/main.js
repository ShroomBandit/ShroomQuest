var chat = require('./chat'),
    map = require('./map'),
	player = require('./player'),
    wss = require('./webSocketServer'),

    gameServer = wss.create(__dirname+'/..', 8083);
    main = false,

start = function() {
    console.log('starting main thread');
    main = setInterval(function() {
        chat.sendAll();
        //player.update();
    }, 100);
},

stop = function() {
    console.log('stopping main thread');
    clearInterval(main);
    main = false;
};

// initialize module here
// most modules will need access to the gameServer
//   so that they can listen to events (messages from the socket)
chat.init(gameServer);
var width = 10000, height = 10000, tilesize = 40,
    tiles = map.generate(width/tilesize, height/tilesize);

gameServer.listen('open', function() {
    if(!main) {
        start();
    };
});

gameServer.listen('login', function(data) {
    // get player's location from database using data.username;
    // instead of broadcasting, we need a way to send individual
    //   messages; perhaps store connections by username?
    gameServer.broadcast('loadGameData', {
        width:width,
        height:height,
        tiles:tiles,
        tilesize:tilesize
    });
});

gameServer.listen('close', function() {
    if(!gameServer.isActive()) {
        stop();
    };
});
