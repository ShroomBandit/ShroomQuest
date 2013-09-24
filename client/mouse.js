module.define('mouse', function() {

    var init = function(send, offsetX, offsetY) {
        document.addEventListener('mouseup', function(event) {
            send('leftmouseup', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
        document.addEventListener('mousedown', function(event) {
            send('leftmousedown', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            send('rightclick', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
    };

    return {
        init:init
    };

});
