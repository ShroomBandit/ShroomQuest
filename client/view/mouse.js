module.define('view/mouse', function() {

    var mouse = {},

    initialize = function() {
        document.addEventListener('mousemove', function(event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });
        mouse.click = false;
        document.addEventListener('mouseup', function(event) {
            mouse.click = true;
        });
        // disable right click menu
        document.oncontextmenu=RightMouseDown;
    },

    draw = function(ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y + 10);
        ctx.lineTo(mouse.x, mouse.y - 10);
        ctx.moveTo(mouse.x - 10, mouse.y);
        ctx.lineTo(mouse.x + 10, mouse.y);
        ctx.closePath();
        ctx.stroke();
    };

    function RightMouseDown(){return false;};

    return {
        initialize:initialize,
        draw:draw
    };

});
