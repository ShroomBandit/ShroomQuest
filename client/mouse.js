module.define('mouse', function() {

    var init = function(socket, offset) {
        document.addEventListener('mouseup', function(event) {
            socket.send('leftmouseup', {x:event.clientX - offset.x, y:event.clientY - offset.y});
        });
        document.addEventListener('mousedown', function(event) {
            socket.send('leftmousedown', {x:event.clientX - offset.x, y:event.clientY - offset.y});
        });
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            socket.send('rightclick', {x:event.clientX - offset.x, y:event.clientY - offset.y});
        });
    };

    return {
        init:init
    };

});
