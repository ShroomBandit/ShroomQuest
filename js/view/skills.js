module.define('view/skills',function(){
	
	var model = module.import('model'),

	draw = function(ctx){
		ctx.strokeStyle = model.colors.black;
		ctx.fillStyle = model.colors.black;

		// top left character name & info?
		ctx.strokeRect (10,10,300,100);
		
		// skills 1 - 0 bottom screen (10 boxes)
		for (var i = ((model.screen.x/2) - 240); i <= ((model.screen.x/2) + 240); i+=50) { 
			ctx.strokeRect (i,model.screen.y-50,40,40);
		};
		
	};
	return {
		draw:draw
	}
});