module.define('logic',function(){
	
    var movement = module.import('logic/movement');

    return {
        update:function() {
            movement.update();
        }
    };
	
});
