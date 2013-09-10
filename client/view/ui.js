module.define('view/ui',function(){
	
	var characterInfo = function(ctx){
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.strokeRect (10,10,300,100);
	},

	minimap = function(ctx){
		ctx.fillStyle = 'rgb(0, 0, 0)';	
		ctx.fillRect (780,10,200,200);
	},
    
    skillbar = function(ctx) {
		// skills 1 - 0 bottom screen (10 boxes)
		for (var i = ((model.screen.x/2) - 240); i <= ((model.screen.x/2) + 240); i+=50) { 
			ctx.strokeRect (i,model.screen.y-50,40,40);
		};
    };

	return {
        characterInfo:characterInfo,
        minimap:minimap,
        skillbar:skillbar
	};

});
