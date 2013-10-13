spider.define('character', function() {

    return Character = {
        create:function() {
            var self = Object.create(this);
            self.direction = 3;
            self.animationStep = 1;
            return self;
        },

        draw:function(ctx, x, y) {
            var img = new Image();
            img.src = '/images/sprites/BODY_animation.png';
            //img.src = slot.toUpperCase()+'_'+type+'.png';
            ctx.drawImage(img, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, 0, 0, 64, 64);
        },

        setPosition:function(x, y) {
            this.x = x;
            this.y = y;
        },

        updateAttrubtes:function(attributes) {
            for(var attr in attributes) {
                this[attr] = attributes[attr];
            };
        }
    };
});
