spider.define('player', function() {

    var extend = spider.import('extend'),
        Character = spider.import('character');

    return Player = extend(Character, {
        create:function(x, y) {
            var self = Character.create.call(this, x, y);
            return self;
        }
    });
});
