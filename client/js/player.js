spider.define(function(require) {

    var extend = require('extend'),
        Character = require('character');

    return Player = extend(Character, {
        create:function(x, y) {
            var self = Character.create.call(this, x, y);
            return self;
        }
    });
});
