if (typeof spider === 'undefined') {
    spider = {
        define: function (constructor) {
            module.exports = constructor();
        }
    }
}

spider.define(function () {

    var isBrowser = typeof window !== 'undefined',

    interface = {

        change: function (listener, context) {
            this._listeners.push({
                ctx:    context || this,
                fn:     listener
            });
            return this;
        },

        _digest: function () {
            var value = this._value;
            this._listeners.forEach(function (listener) {
                listener.fn.call(listener.ctx, value);
            });
        },

        get: function () {
            return this._value;
        },

        set: function (newValue, options) {
            if (this._value !== newValue) {
                this._value = newValue;
                this._digest();

                // The silently option should only be used by the setter methods stored in Sync._setters.
                if (options === undefined || options.silently !== true) {
                    // The this._sync method is added at creation.
                    this._sync(this._prop, newValue)
                }
            }
        }

    },

    Sync = {

        _callSetter: function (data) {
            if ('prop' in data) {
                this._setters[data.prop](data.value);
            } else {
                throw new Error('Received bad message: ' + JSON.stringify(data));
            }
        },

        create: function (prop, value) {
            var self = Object.create(interface);

            // Initialize all the "private" variables.
            self._prop = prop;
            self._value = null;
            self._listeners = [];

            // Every property must have access to the private sync method.
            self._sync = this._sync.bind(this);

            // Store a reference to the setter so it can be called
            // when a new value is received from the socket.
            this._setters[prop] = function (newValue) {
                self.set(newValue, {silently: true});
            };

            if (arguments.length > 1) {
                self.set(value);
            }

            return self;
        },

        flush: function (options) {
            var string = JSON.stringify(this._staged);
            this._staged = [];

            if (options !== undefined && options.doNotSend === true) {
                return string;
            } else {
                send(string)
            }
        },

        _handleMessage: function (raw) {
            var data = JSON.parse(raw.data);

            if (Array.isArray(data)) {
                data.forEach(callSetter)
            } else {
                this._callSetter(data);
            }
        },

        init: function(ws) {
            if (typeof ws === 'string') {
                this._socket = new WebSocket('ws://' + ws);
            } else {
                this._socket = ws;
            }

            this._socket.onopen = function() { console.log('Socket opened.'); }
            this._socket.onmessage = this._handleMessage.bind(this);
            this._socket.onclose = function() { console.log('Socket closed.'); }
        },

        _send: function (data) {
            this._socket.send(JSON.stringify(data));
        },

        _sync: function (prop, value) {
            var data = {
                prop:   prop,
                value:  value
            };

            if (this._stage) {
                this._staged.push(data);
            } else {
                this._send(data);
            }
        }
    };

    function createSync(ws, options) {
        var self = Object.create(Sync);

        options = options || {};

        // Optionally postpone initialization of the library.
        if (arguments.length > 0) {
            self.init(ws);
        }

        self._setters = {};
        self._stage = options.stage || false;
        self._staged = [];

        return self;
    }

    if (isBrowser) {
        return createSync();
    } else {
        return createSync;
    }

});
