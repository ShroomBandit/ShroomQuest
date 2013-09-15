module.exports = extend = function(oldConstructor, newProps) {
    var newConstructor = function() {};
    newConstructor.prototype = Object.create(oldConstructor.prototype);
    newConstructor.prototype.parentInit = oldConstructor.prototype.init;
    for(var name in newProps) {
        newConstructor.prototype[name] = newProps[name];
    };
    return newConstructor;
};
