spider.define(function (require) {
    
    var Sync = require('../../shared/Sync'),
        
        offsetX, offsetY;
        
    function init(x, y) {
        offsetX = x;
        offsetY = y;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('contextmenu', handleRightClick);
    }

    function handleMouseDown(event) {
        if (skills[selectedSkill]) {
            send('leftmousedown', {
                x:event.clientX - offsetX,
                y:event.clientY - offsetY,
                skill:skills[selectedSkill]
            });
        } else {
            warn('That ability is not equipped.');
        }
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
        if (direction !== newDirection) {
            direction = newDirection;
            //send('changeDirection', direction);
        }
    }
    
    function handleMouseUp(event) {
        //var button = ('which' in event) ? event.which : event.button;
        send('leftmouseup', {x:event.clientX - offsetX, y:event.clientY - offsetY});
    }
    
    function handleRightClick(event) {
        event.preventDefault();
        send('rightclick', {x:event.clientX - offsetX, y:event.clientY - offsetY});
    }
        
    return {
        init: init
    }
});
