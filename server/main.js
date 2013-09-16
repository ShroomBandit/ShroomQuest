var chat = require('./chat'),
    map = require('./map'),
	Player = require('./player'),
    wss = require('./webSocketServer'),

    gameServer = wss.create(__dirname+'/..', 8083),
    main = false,
    //players = [],

start = function() {
    console.log('starting main thread');
    main = setInterval(update, 100);
},

stop = function() {
    console.log('stopping main thread');
    clearInterval(main);
    main = false;
},

update = function() {
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
    /*for(var i = 0, ilen = players.length; i++) {
        players[i].
    };*/
    if(events.length > 0) {
        gameServer.broadcast('update', JSON.stringify(events));
    };
};

chat.init(gameServer);

gameServer.listen('open', function(ws) {
    if(!main) {
        start();
    };
    /*var i = players.length;
    players[i] = new Player();
    players[i].playerInit(ws);*/
});

gameServer.listen('close', function() {
    if(!gameServer.isActive()) {
        stop();
    };
});
