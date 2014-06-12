spider.define(function () {

    return {

        create: function (x, y) {
            var self = Object.create(this);
            self.x = x;
            self.y = y;
            self.prevX = x;
            self.prevY = y;
            self.animationDelay = 100;
            self.animationStep = 1;
            self.animationTime = Date.now();
            self.direction = 3;
            return self;
        },

        draw: function (ctx, x, y, images) {
            this.updateSprite();
            ctx.drawImage(images.body, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
            ctx.drawImage(images.feet, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
            ctx.drawImage(images.legs, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
            ctx.drawImage(images.torso, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
            ctx.drawImage(images.belt, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
            ctx.drawImage(images.hair, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
            ctx.drawImage(images.head, (this.animationStep-1)*64, (this.direction-1)*64, 64, 64, x-32, y-32, 64, 64);
        },

        getPosition: function () {
            return {
                x: this.x,
                y: this.y
            }
        },

        updateAttributes: function (attributes) {
            for(var attr in attributes) {
                this[attr] = attributes[attr];
            };
        },

        updateSprite: function () {
            var time = Date.now();
            if (time - this.animationDelay > this.animationTime) {
                if (this.prevX !== this.x || this.prevY !== this.y) {
                    this.animationStep = (this.animationStep % 9) + 1;
                    this.prevX = this.x;
                    this.prevY = this.y;
                } else if (this.animationStep !== 1) {
                    this.animationStep = 1;
                }
                this.animationTime = time;
            }
        }

    }

});
