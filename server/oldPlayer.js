var gs,
    vel = {
		straight:5,
		diagonal:Math.round(5/Math.sqrt(2))
	},

init = function(gameServer) {
    gs = gameServer;
    gs.listen('player', function(data) {
    });
},

update = function(){
	var type = 'straight';
	if ((model.keys.w || model.keys.s) && (model.keys.a || model.keys.d)){
		type = 'diagonal';
	};
	if (model.keys.w){
		model.me.y -= vel[type];
        moved = true;
	}else if (model.keys.a){
		model.me.x -= vel[type];
        moved = true;
	}else if (model.keys.s){
		model.me.y += vel[type];
        moved = true;
	}else if (model.keys.d){
		model.me.x += vel[type];
        moved = true;
	}else{
        moved = false;
    };
    if(moved) socket.send('player', {username:model.username,pos:model.me});
}; 

exports.update = update;
