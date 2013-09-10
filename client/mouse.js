module.define('mouse', function() {

    var init = function(ws) {
        document.addEventListener('mouseup', function(event) {
            socket.send('leftmouseup', {x:event.clientX, y:event.clientY});
        });
        document.addEventListener('mousedown', function(event) {
            socket.send('leftmousedown', {x:event.clientX, y:event.clientY});
        });
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            socket.send('rightclick', {x:event.clientX, y:event.clientY});
        });
    };

    return {
        init:init
    };

});
