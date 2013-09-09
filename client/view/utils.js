module.define('view/utils', function() {

        fps = '--',
        frameCount = 0,
        lastWrite = 0;

    return {
        framerate:function(ctx, x, y, delta) {
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
        }
    };

});
