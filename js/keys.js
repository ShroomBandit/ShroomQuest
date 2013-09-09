module.define('keys',function(){
	var model = module.import('model'),
		
		keymap = {
			'87':'w',
			'65':'a',
			'83':'s',
			'68':'d',
			'16':'shift',
			'49':'1',
			'50':'2',
			'51':'3',
			'52':'4',
			'53':'5',
			'54':'6',
			'55':'7',
			'56':'8',
			'57':'9'
		};

	model.keys = {
		w:false,
		a:false,
		s:false,
		d:false,
		shift:false,
		'1':false,
		'2':false,
		'2':false,
		'4':false,
		'5':false,
		'6':false,
		'7':false,
		'8':false,
		'9':false
	};

	document.addEventListener('keydown', function(event){
        if(!model.chatting) {
            model.keys[keymap[event.keyCode]] = true;
        };
	});

	document.addEventListener('keyup', function(event){
        model.keys[keymap[event.keyCode]] = false;
	});

    // what is this for?
	/*document.addEventListener('keypress', function(event){
        model.keys[keymap[event.keyCode]] = true;
	});*/

});
