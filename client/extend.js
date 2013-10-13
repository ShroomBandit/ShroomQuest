spider.define('extend', function() {
    return function(oldPrototype, extension) {
        // copy the object to inherit to prototype of the new object
        var newPrototype = Object.create(oldPrototype);

        // add all the properties and methods from the extension object
        // to the new prototype's prototype
        for(var name in extension) {
            newPrototype[name] = extension[name];
        };

        // return the new prototype
        return newPrototype;
    };
});
