var	gs,
    messages = [],

init = function(gameServer) {
	gs = gameServer;
	gs.listen('chat', function(data) {
		messages.push(data);
	});
},

sendAll = function() {
    if(messages.length > 0) {
        gs.broadcast('chat', messages);
        messages = [];
    };
};

exports.init = init;
exports.sendAll = sendAll; 
