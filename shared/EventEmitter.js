if (typeof spider === 'undefined') {
    var spider = {
        define: function (constructor) {
            module.exports = constructor();
        }
    }
}

spider.define(function () {

    return {

        emit: function (event /*, args...*/) {
            var args;

            if (Array.isArray(event)) {
                var fn = this.emit.bind(this);
                event.forEach(fn);
                return this;
            }

            if (!('_listeners' in this && event in this._listeners)) {
                return this;
            }

            args = Array.prototype.slice.call(arguments);
            args.shift();

            this._listeners[event].forEach(function (listener) {
                listener.fn.apply(listener.ctx, args);
            });

            return this;
        },

        on: function(event, listener, context) {
            if (!('_listeners' in this)) {
                this._listeners = {};
            }

            if (Array.isArray(event)) {
                var self = this;
                event.forEach(function (evt) {
                    self.on(evt, listener, context);
                });
                return this;
            }

            if (!(event in this._listeners)) {
                this._listeners[event] = []
            }

            this._listeners[event].push({
                ctx:    context || this,
                fn:     listener
            });

            return this;
        },

        once: function(event, listener, context) {
            this.on(event, function () {
                listener.apply(context || this, Array.prototype.slice.call(arguments));
                this.off(event, listener);
            }, this);

            return this;
        },

        off: function(event, listener) {
            if (Array.isArray(event)) {
                var self = this;
                event.forEach(function (evt) {
                    self.off(evt, listener);
                });
                return this;
            }

            if (listener === undefined) {
                this._listeners[event] = [];
            } else {
                for (var i = 0; i < this._listeners[event].length; i++) {
                    if (this._listeners[event][i] === listener) {
                        this._listeners[event].splice(i, 1);
                        break;
                    }
                }
            }

            return this;
        }

    }

});
