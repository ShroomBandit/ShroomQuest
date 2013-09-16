module.exports = extend = function(oldConstructor, newProps) {
    var newConstructor = function() {};
    newConstructor.prototype = Object.getPrototypeOf(Object.create(oldConstructor.prototype));
    for(var name in newProps) {
        newConstructor.prototype[name] = newProps[name];
    };
    newConstructor.prototype.constructor = newConstructor;
    return newConstructor;
};
