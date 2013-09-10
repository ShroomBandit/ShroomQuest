module.define('main', function() {
    
    var chat = module.import('chat'),
        input = module.import('input'),
        keys = module.import('keys'),
        model = module.import('model'),
        mouse = module.import('mouse'),
        socket = module.import('socket'),
        view = module.import('view'),

    step = function() {
        view.render(delta);
        requestAnimationFrame(step);
    };

    document.getElementById('login').addEventListener('click', function() {
        model.username = document.getElementById('username').value;
        var dialog = document.getElementById('loginDialog');
        dialog.parentNode.removeChild(dialog);
        socket.listen('open', function() {
            socket.send('load', model.username);
        });
        socket.open(location.host);
        // rather than requesting new animation frames when ready,
        // request animation frame when ready UNLESS no new data has been sent
        //socket.listen('all', step);
        socket.listen('load', function(data) {
            chat.init(socket);
            input.init(socket);
            keys.init(socket);
            mouse.init(socket);
            view.init(data, step);
        });
    });

});
