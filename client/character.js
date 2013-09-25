module.define('character',function(){
	
	var draw = function(ctx, x, y){
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.beginPath();
		ctx.arc(x, y, 12, 0, Math.PI*2, false);
		ctx.closePath();
		ctx.fill();
	};

	return {
		draw:draw
	};

});
