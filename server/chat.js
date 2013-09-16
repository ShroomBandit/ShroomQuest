var messages = [],

init = function(gameServer) {
	gameServer.listen('chat', function(data) {
		messages.push(data);
	});
},

getAll = function() {
    if(messages.length > 0) {
        var temp = messages;
        messages = [];
        return temp;
    }else{
        return false;
    };
};

exports.init = init;
exports.getAll = getAll; 
