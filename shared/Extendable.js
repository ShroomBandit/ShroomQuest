if (typeof spider === 'undefined') {
    var spider = {
        define: function (constructor) {
            module.exports = constructor();
        }
    }
}

spider.define(function () {

    return {

        extend: function () {
            var extensions = Array.prototype.slice.call(arguments),
                self = Object.create(this);

            extensions.forEach(function (extension) {
                for (var property in extension) {
                    if (extension.hasOwnProperty(property)) {
                        self[property] = extension[property];
                    }
                }
            });

            return self;
        }

    }

});
