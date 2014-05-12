spider.define(function() {

    var fps = '--',
        frameCount = 0,
        lastWrite = 0,
        previous = Date.now(),

    framerate = function(ctx, x, y) {
        var current = Date.now(),
            delta = current - previous;

        frameCount++;
        lastWrite += delta;
        if(lastWrite > 1000) {
            fps = Math.round(frameCount/lastWrite*1000);
            frameCount = 0;
            lastWrite = 0;
        };
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillText(fps, x, y);
        previous = current;
    };

    return {
        framerate:framerate
    };

});
