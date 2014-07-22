if (typeof spider === 'undefined') {
    var spider = {
        define: function (constructor) {
            module.exports = constructor();
        }
    }
}

spider.define(function () {

    return {

        extend: function (/* extensions... */) {
            var extensions = Array.prototype.slice.call(arguments),
                self = Object.create(this);

            extensions.forEach(function (extension) {
                Object.keys(extension).forEach(function (property) {
                    self[property] = extension[property];
                });
            });

            return self;
        }

    }

});
