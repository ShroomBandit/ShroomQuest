module.define('main', function() {
    
    var chat = module.import('chat'),
        input = module.import('input'),
        keys = module.import('keys'),
        model = module.import('model'),
        mouse = module.import('mouse'),
        socket = module.import('socket'),
        view = module.import('view'),

    step = function() {
        view.render();
        requestAnimationFrame(step);
    };

    document.getElementById('login').addEventListener('click', function() {
        model.username = document.getElementById('username').value;
        var dialog = document.getElementById('loginDialog');
        dialog.parentNode.removeChild(dialog);
        socket.listen('open', function() {
            socket.send('login', model.username);
        });
        socket.open(location.host);
        // rather than requesting new animation frames when ready,
        // request animation frame when ready UNLESS no new data has been sent
        //socket.listen('all', step);
        socket.listen('loadGameData', function(data) {
            view.init(data, function() {
                chat.init(socket);
                keys.init(socket);
                input.init(socket);
                mouse.init(socket, view.getOffset());
                step();
            });
        });
    });

});
