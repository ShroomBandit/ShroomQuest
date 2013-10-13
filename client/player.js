spider.define('player', function() {

    var extend = spider.import('extend'),
        Character = spider.import('character');

    return Player = extend(Character, {
        create:function() {
            var self = Character.create.call(this);
            // lastPosition
            return self;
        }
    });
});
