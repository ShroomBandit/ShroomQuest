var Character = require('./character'),
    
    parentInit = Character.prototype.init,
    Player = function() {};

Player.prototype = Object.create(Entity.prototype);

Player.prototype.init = function(connection, id) {
    // normally load x and y from database...
    x = 1000;
    y = 1000;
    parentInit.call(this, x, y, 'player', username);
};

module.exports = Player;
