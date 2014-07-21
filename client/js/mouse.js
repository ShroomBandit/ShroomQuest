spider.define(function (require) {
    
    var Sync = require('Sync'),
        
        offsetX, offsetY,
        
        direction = Sync.create('direction', 1),
        leftClick = Sync.create('leftClick'),
        rightClick = Sync.create('rightClick');
        
    function init(x, y) {
        offsetX = x;
        offsetY = y;
        
        document.addEventListener('mousemove', handleMouseMove);
        //document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleLeftClick);
        document.addEventListener('contextmenu', handleRightClick);
    }

    function handleLeftClick(event) {
        leftClick.set({
            x: event.clientX - offsetX,
            y: event.clientY - offsetY
        });
    }
    
    function handleMouseMove(event) {
        var newDirection,
            relX = event.clientX - offsetX,
            relY = event.clientY - offsetY;

        if (relX >= relY) {
            // bottom-right side of line y = x
            if (relX >= Math.abs(relY)) {
                newDirection = 4;
            } else {
                newDirection = 1;
            }
        } else {
            // top-left side of line y = x
            if (Math.abs(relX) >= relY) {
                newDirection = 2;
            } else {
                newDirection = 3;
            }
        }
        //console.log(relX, relY, newDirection);
        if (direction.get() !== newDirection) {
            direction.set(newDirection);
        }
    }
    
    /*function handleMouseUp(event) {
        //var button = ('which' in event) ? event.which : event.button;
        send('leftmouseup', {x:event.clientX - offsetX, y:event.clientY - offsetY});
    }*/
    
    function handleRightClick(event) {
        event.preventDefault();
        rightClick.set({
            x: event.clientX - offsetX,
            y: event.clientY - offsetY
        });
    }
        
    return {
        init: init
    }
});