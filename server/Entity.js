module.exports = {

    create: function (id, type, x, y, hitRadius) {
        var self = Object.create(this);
        self.id = id;
        self.type = type;
        self.setPosition(x, y);
        self.hitRadius = hitRadius;
        return self;
    },

    extend: function (extension) {
        var self = Object.create(this);

        Object.keys(extension).forEach(function (property) {
            self[property] = extension[property];
        });

        return self;
    },

    getPosition: function () {
        return {
            x: this.x,
            y: this.y
        }
    },

    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
    }

}
