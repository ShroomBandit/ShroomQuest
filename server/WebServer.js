/** @module */

'use strict';

var fs      = require('fs'),
    http    = require('http'),
    path    = require('path'),
    url     = require('url'),

    contentTypesByExt = {
        '.html':    'text/html',
        '.css':     'text/css',
        '.js':      'text/javascript'
    };

// Attempt to find and respond with a file that matches the uri
// so that requests to a file do not have to be registered.
function attemptResponseWithFile(filename, response) {
    fs.exists(filename, function(exists) {
        if(exists) {
            if(fs.statSync(filename).isDirectory()) {
                filename += 'index.html';
            }

            fs.readFile(filename, function(err, file) {
                if(err) {
                    respond(response, 500, {'Content-Type':'text/plain'}, 'Error loading ' + filename)
                } else {
                    var headers = {},
                        contentType = contentTypesByExt[path.extname(filename)];

                    if(contentType) {
                        headers['Content-Type'] = contentType;
                    }
                    respond(response, 200, headers, file);
                }
            });
        } else {
            send404(response);
        }
    });
}

function findMatch(path, rewrites) {
    var i = 0;

    while (i < rewrites.length && rewrites[i].pattern.exec(path) === null) {
        i++;
    }

    if (i < rewrites.length) {
        return path.replace(rewrites[i].pattern, rewrites[i].path);
    } else {
        return false;
    }
}

function handleRequest(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(this.root, uri),
        match = findMatch(uri, this.rewrites);

    // Check for the uri in the router.
    if (request.method in this.router && uri in this.router[request.method]) {
        this.router[request.method][uri](request, response);
    } else if (request.method === 'GET') {
        attemptResponseWithFile(match ? this.root + match : filename, response);
    } else {
        send404(response);
    }
}

/**
 * A small convenience method for responding to requests
 * @method
 * @param {object} response - The response object passed into a request handler
 * @param {number} code
 * @param {object} headers
 * @param {string} data
 */
function respond(response, code, headers, data) {
    response.writeHead(code, headers);
    response.write(data);
    response.end();
}

function send404(response) {
    respond(response, 404, {'Content-Type':'text/plain'}, '404 Not Found\n');
}

module.exports = {

    /**
     * @param {string} root - The root path from which to serve files.
     * @param {number} port - The port on which the server will listen for requests.
     */
    create: function (root, port) {
        var self = Object.create(this);
        self.rewrites = [];
        self.root = root;
        self.router = {};
        self.http = http.createServer(handleRequest.bind(self)).listen(port);
        console.log('Starting webserver on port %d.', port);
        return self;
    },

    /**
     * Convinience wrapper for registering get request handlers
     * @param {string} route
     * @param {function} callback
     */
    get: function (route, callback) {
        this.register(route, 'GET', callback);
    },

    /**
     * Convinience wrapper for registering post request handlers
     * @param {string} route
     * @param {function} callback
     */
    post: function (route, callback) {
        this.register(route, 'POST', function(request, response) {
            request.setEncoding('utf8');
            request.on('data', function(data) {
                request.formData = JSON.parse(data);
            });
            request.on('end', function() {
                callback(request, response);
            });
        });
    },

    /**
     * Register a request handler for a given route and method
     * @param {string} route
     * @param {string} method - The http request method (e.g. 'GET')
     * @param {function} callback
     */
    register: function (route, method, callback) {
        if(!(method in this.router)) {
            this.router[method] = {};
        }

        // Handle an array of route objects.
        if(!Array.isArray(route)) {
            this.router[method][route] = callback;
        } else {
            for(var i = 0; i < route.length; i++) {
                this.register(route[i], method, callback);
            }
        }
    },

    respond: respond,

    /**
     * @param {object} pattern - A regex object used to match against incomming request routes
     * @param {string} path The path that matches of the pattern will be redirected to
     */
    rewrite: function (pattern, path) {
        this.rewrites.push({
            path:       path,
            pattern:    pattern
        });
    }

}
