'use strict';

var createSync      = require('../shared/Sync.js'),
    WebServer       = require('./WebServer'),
    WebSocketServer = require('./WebSocketServer'),
    worldManager    = require('./worldManager'),

    webServer = WebServer.create(__dirname + '/..', 8080);


//webServer.rewrite(/^(?!\/shared)(.*)$/, '/client$1');
//webServer.rewrite(/^$/, '/client/index.html');

function handleNewConnection(socket) {
    var ipAddress = socket.upgradeReq.connection.remoteAddress,

        Sync = createSync(socket),
        loginStatus = Sync.create('loginStatus'),
        port        = Sync.create('port'),
        worldList   = Sync.create('worldList', worldManager.getWorldList());

    function assignPlayerToWorld(username, worldId) {
        if (worldManager.assignPlayer(worldId, getPlayerData(username), ipAddress)) {
            connectPlayerToWorld(worldId);
        } else {
            sendWorldList();
        }
    }

    function connectPlayerToWorld(worldId) {
        var world = worldManager.getWorld(worldId);
        if (world !== null) {
            port.set(world.server.port);
            socket.close();
        } else {
            console.log('Internal error: could not get world. <server/main.js#connectPlayerToWorld>')
            sendWorldList();
        }
    }

    function loginToWorld(loginData) {
        if (authenticatePlayer(loginData.username, loginData.password)) {
            assignPlayerToWorld(loginData.username, loginData.world);
        } else {
            loginStatus.set('Login failed.');
        }
    }

    function authenticatePlayer(username, password) {
        return true;
    }

    function getPlayerData(username) {
        return {
            username: username
        }
    }

    function sendWorldList() {
        worldList.set(worldManager.getWorldList());
    }

    Sync.create('loginData', {}, {watch: true, silently: true}).on('change', loginToWorld);
}

WebSocketServer.create({server: webServer.http})
    .on('connection', handleNewConnection);
