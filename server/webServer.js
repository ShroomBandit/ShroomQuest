var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    url = require('url'),

    contentTypesByExt = {
        '.html':'text/html',
        '.css':'text/css',
        '.js':'text/javascript'
    };

exports.create = function(root, port){ 
    var server = http.createServer(function(request, response) {
        var uri = url.parse(request.url).pathname,
            filename = path.join(root, uri);

        fs.exists(filename, function(exists) {
            if(!exists) {
                response.writeHead(404, {'Content-Type':'text/plain'});
                response.write('404 Not Found\n');
                response.end();
            }else{
                if(fs.statSync(filename).isDirectory()) filename += 'index.html';
                fs.readFile(filename, function(err, file) {
                    if(err) {
                        response.writeHead(500);
                        response.write('Error loading ' + filename);
                        response.end();
                    }else{
                        var headers = {},
                            contentType = contentTypesByExt[path.extname(filename)];
                        if(contentType) headers['Content-Type'] = contentType;
                        response.writeHead(200, headers);
                        response.write(file);
                        response.end();
                    };
                });
            };
        });
    }).listen(port);
    console.log('Listening to port %d.', port);
    return server;
};
