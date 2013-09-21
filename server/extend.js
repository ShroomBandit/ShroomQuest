module.exports = extend = function(oldConstructor, extension) {
    // set the init() function as the new constructor
    // and remove it from the extension object,
    // since it does not need to be in the prototype
    newConstructor = ('init' in extension) ? extension.init : function() {};

    // add all the properties and methods from the old constructor's prototype
    // to the new constructor's prototype
    if(oldConstructor) {
        for(var name in oldConstructor.prototype) {
            newConstructor.prototype[name] = oldConstructor.prototype[name];
        };
    };

    // add all the properties and methods from the extension object
    // to the new constructor's prototype
    for(var name in extension) {
        newConstructor.prototype[name] = extension[name];
    };

    // return the new constructor
    return newConstructor;
};
