spider.define('character', function() {

    return Character = {
        create:function() {
            var self = Object.create(this);
            self.direction = 3;
            self.animationStep = 1;
            return self;
        },

        draw:function(ctx, x, y, image) {
            ctx.drawImage(image, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
        },

        getPosition:function() {
            return {
                x:this.x,
                y:this.y
            };
        },

        setPosition:function(x, y) {
            this.x = x;
            this.y = y;
        },

        updateAttributes:function(attributes) {
            for(var attr in attributes) {
                this[attr] = attributes[attr];
            };
        }
    };
});
