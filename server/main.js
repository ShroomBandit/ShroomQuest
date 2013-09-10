var gameServer = require('./gameServer'),
	chat = require('./chat'),
	player = require('./player');

gameServer.create(__dirname+'/..', 8083);

chat.init(gameServer);

var main = function() {
	while(gameServer.isActive()) {
		// find changes to model, update logic
		var data = {};
		for(var change in changes) {
			data[change] = changes[change].data;
		};
		// the last piece of our while loop is to emit all changes to all (applicable) users
		chat.sendAll();
		player.update();
	};
};