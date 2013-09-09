module.define('view/minimap',function(){
	
	var model = module.import('model'),

	draw = function(ctx){

		ctx.strokeStyle = model.colors.black;
		ctx.fillStyle = model.colors.black;	

		ctx.fillRect (model.screen.x-210,10,200,200);
		ctx.strokeStyle = model.colors.white;
		ctx.fillText ('Minimap',model.screen.x-150,100);

	};
	return {
		draw:draw
	}
});