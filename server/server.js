var fs = require('fs'),
    http = require('http'),
    keys = require('./js/keys'),
    path = require('path'),
    url = require('url'),
    WebSocketServer = require('ws').Server,

    contentTypesByExt = {
        '.html':'text/html',
        '.css':'text/css',
        '.js':'text/javascript'
    },
    port = 8083,

server = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(__dirname, uri);

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

var wss = new WebSocketServer({server:server}),
    clients = [],
    model = {
        players:{}
    };

wss.broadcast = function(msg) {
    for(var i in this.clients) {
        this.clients[i].send(msg);
    };
};


wss.on('connection', function(ws) {
    console.log('connected to a new client');
    ws.on('message', function(raw) {
        var msg = JSON.parse(raw);
        if(msg.type === 'chat') {
            wss.broadcast(JSON.stringify({
                type:'chat',
                data:msg.data
            }));
        }else if(msg.type === 'player') {
            model.players[msg.data.username] = msg.data.pos;
            wss.broadcast(JSON.stringify({
                type:'players',
                data:model.players
            }));
        };
    });
    ws.on('close', function() {
        console.log('disconnected from a client');
    });
});
