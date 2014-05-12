var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    url = require('url'),

    contentTypesByExt = {
        '.html':'text/html',
        '.css':'text/css',
        '.js':'text/javascript'
    };

module.exports = webServer = {

    router:{},

    get:function(route, callback) {
        this.register(route, 'GET', callback);
    },

    init:function(root, port) {
        var self = this;
        this.http = http.createServer(function(request, response) {
            var uri = url.parse(request.url).pathname,
                filename = path.join(root, uri);
            if(request.method in self.router && uri in self.router[request.method]) {
                self.router[request.method][uri](request, response);
            } else if(request.method === 'GET') {
                fs.exists(filename, function(exists) {
                    if(exists) {
                        if(fs.statSync(filename).isDirectory()) filename += 'index.html';
                        fs.readFile(filename, function(err, file) {
                            if(err) {
                                response.writeHead(500);
                                response.write('Error loading ' + filename);
                                response.end();
                            } else {
                                var headers = {},
                                    contentType = contentTypesByExt[path.extname(filename)];
                                if(contentType) headers['Content-Type'] = contentType;
                                self.respond(response, 200, headers, file);
                            };
                        });
                    } else {
                        self.send404(response);
                    };
                });
            } else {
                self.send404(response);
            };
        }).listen(port);
        console.log('Listening to port %d.', port);
    },

    post:function(route, callback) {
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

    register:function(route, method, callback) {
        if(!(method in this.router))
            this.router[method] = {};
        if(!Array.isArray(route))
            this.router[method][route] = callback;
        else
            for(var i = 0; i < route.length; i++)
                this.register(route[i], method, callback);
    },

    respond:function(response, code, headers, data) {
        response.writeHead(code, headers);
        response.write(data);
        response.end();
    },

    send404:function(response) {
        this.respond(response, 404, {'Content-Type':'text/plain'}, '404 Not Found\n');
    }

};
