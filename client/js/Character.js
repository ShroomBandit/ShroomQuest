spider.define(function (require) {

    var Entity  = require('./Entity'),
        Sync    = require('Sync');

    return Entity.extend({

        create: function (id) {
            var self = Entity.create.call(this, id);
            self.prevX = self.x.get();
            self.prevY = self.y.get();
            self.animationDelay = 100;
            self.animationStep = 1;
            self.animationTime = Date.now();
            self.direction = Sync.create('direction', 3);
            return self;
        },

        draw: function (ctx, x, y, images) {
            var parts = ['body', 'feet', 'legs', 'torso', 'belt', 'hair'],
                self = this;
            this.updateSprite();
            parts.forEach(function (part) {
                self.drawPart(ctx, x, y, images[part]);
            });
        },

        drawPart: function (ctx, x, y, image) {
            ctx.drawImage(image, (this.animationStep-1)*64, (this.direction.get()-1)*64, 64, 64, x-32, y-32, 64, 64);
        },

        /*updateAttributes: function (attributes) {
            for(var attr in attributes) {
                this[attr] = attributes[attr];
            };
        },*/

        updateSprite: function () {
            var time = Date.now(),
                x = this.x.get(),
                y = this.y.get();
            if (time - this.animationDelay > this.animationTime) {
                if (this.prevX !== x || this.prevY !== y) {
                    this.animationStep = (this.animationStep % 9) + 1;
                    this.prevX = x;
                    this.prevY = y;
                } else if (this.animationStep !== 1) {
                    this.animationStep = 1;
                }
                this.animationTime = time;
            }
        }

    });

});
