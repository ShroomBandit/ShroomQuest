module.define('main', function() {
    
    var chat = module.import('chat'),
        keys = module.import('keys'),
        logic = module.import('logic'),
        model = module.import('model'),
        socket = module.import('socket'),
        view = module.import('view'),

        loginDialog = document.getElementById('loginDialog'),
        previous = Date.now(),

    step = function() {
        var current = Date.now(),
            delta = current - previous;

        // start updating
        logic.update(delta);
        view.draw(delta);
        // stop updating
        previous = current;
        requestAnimationFrame(step);
    };

    window.log = function() {
        console.log(model);
    };

    document.getElementById('login').addEventListener('click', function() {
        model.username = document.getElementById('username').value;
        document.getElementById('loginDialog').style.display = 'none';
        model.me = {
            x:5000,
            y:2500
        };
        view.initialize();
        socket.init();
        chat.enable();
        step();
    });

});
