if (typeof spider === 'undefined') {
    var spider = {
        define: function (constructor) {
            module.exports = constructor(require);
        }
    }
}

spider.define(function (require) {

    var EventEmitter    = require('./EventEmitter'),
        Extendable      = require('./Extendable'),
    
        Sync,

        isBrowser = typeof window !== 'undefined',

    StandardInterface = Extendable.extend({

        get: function () {
            return this._value;
        },

        set: function (newValue, options) {
            if (this._value !== newValue) {
                this._value = newValue;

                // The silently option should only be used by the setter methods stored in Sync._setters.
                if (options === undefined || options.silently !== true) {
                    // The this._sync method is added at creation.
                    this._sync(this._prop, newValue)
                }
            }
        }

    }),

    EventInterface = StandardInterface.extend(EventEmitter);
    EventInterface.set = function (newValue) {
        var didChange = this._value !== newValue;
        StandardInterface.set.apply(this, Array.prototype.slice.call(arguments));
        if (didChange) {
            this.emit('change', newValue);
        }
    };

    Sync = {

        _callSetter: function (data) {
            if ('prop' in data) {
                if(data.prop in this._setters) {
                    this._setters[data.prop](data.value);
                } else {
                    // TODO: create silently
                    this.create(data.prop, data.value);
                }
            } else {
                throw new Error('Received bad message: ' + JSON.stringify(data));
            }
        },

        create: function (prop, value, options) {
            if(prop in this._setters) {
                throw new Error('Property ' + prop + ' already exists.');
            }

            options = options || {};

            var self = Object.create(('watch' in options && options.watch === true) ? EventInterface : StandardInterface);

            // Initialize all the "private" variables.
            self._prop = prop;
            self._value = undefined;

            // Every property must have access to the private sync method.
            self._sync = this._sync.bind(this);

            // Store a reference to the setter so it can be called
            // when a new value is received from the socket.
            this._setters[prop] = function (newValue) {
                self.set(newValue, {silently: true});
            };

            if (arguments.length > 1) {
                self.set(value, {silently: options.silently || false});
            }

            return self;
        },

        flush: function (options) {
            if (options !== undefined && options.local === true) {
                var str = JSON.stringify(this._staged);
                this._staged = [];
                return JSON.parse(str);
            } else {
                this.send(this._staged);
                this._staged = [];
            }
        },

        _handleMessage: function (raw) {
            console.log(raw.data);
            var data = JSON.parse(raw.data);

            if (Array.isArray(data)) {
                data.forEach(this._callSetter.bind(this))
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

            this._socket.onopen = function() {
                console.log('Socket opened.');
                if (!this._stage && this._staged.length > 0) {
                    this.flush();
                }
            }.bind(this);
            this._socket.onmessage = this._handleMessage.bind(this);
            this._socket.onclose = function() {
                console.log('Socket closed.');
            }
        },

        send: function (data) {
            this._socket.send(typeof data === 'string' ? data : JSON.stringify(data));
            console.log(typeof data === 'string' ? data : JSON.stringify(data));
        },

        _sync: function (prop, value) {
            var data = {
                prop:   prop,
                value:  value
            };

            // Auto-stage any properties created before the socket is ready.
            if (this._stage || !('_socket' in this && this._socket.readyState === 1)) {
                this._staged.push(data);
            } else {
                this.send(data);
            }
        }
    };

    function createSync(ws, options) {
        var self = Object.create(Sync);

        options = options || {};

        self._registry = {};
        self._setters = {};
        self._stage = options.stage || false;
        self._staged = [];

        // Optionally postpone initialization of the library.
        if (arguments.length > 0) {
            self.init(ws);
        }

        return self;
    }

    if (isBrowser) {
        return createSync();
    } else {
        return createSync;
    }

});
