var messages = [],
	gs,

init = function(gameServer) {
	gs = gameServer;
	gs.listen('chat', function(data) {
		mesages.push(data);
	});
},

sendAll = function() {
	gs.broadcast('chat', messages);
	messages = [];
};

exports.init = init;
exports.sendAll = sendAll; 
/*exports = {
	init:init,
	sendAll:sendAll
};*/