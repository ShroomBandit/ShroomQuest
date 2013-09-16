module.define('view/map', function() {
    
    var map, gameWindow, loadCallback,
        tiles, tilesize,
        loaded = 0,

    config = function(mapData, gameWindowX, gameWindowY) {
        // mapData must have the properties:
        //   width, height, tiles, tilesize
        tiles = mapData.tiles;
        tilesize = mapData.tilesize;
        // width and height are passed as number of pixels
        map = {
            x:mapData.width/tilesize,
            y:mapData.height/tilesize
        };
        gameWindow = {
            pixels:{x:gameWindowX, y:gameWindowY},
            tiles:{
                x:Math.ceil(gameWindowX/tilesize),
                y:Math.ceil(gameWindowY/tilesize)
            }
        };
    },

    loadTiles = function(callback) {
        loadCallback = callback;
        var frag = document.createDocumentFragment();
        for(var i = 0; i < 16; i++) {
            if(i !== 5 && i !== 10) {
                var bin = ('000' + i.toString(2)).slice(-4),
                    img = document.createElement('img');
                img.src = '/images/tiles/' + bin + '.png';
                img.id = bin;
                img.style.display = 'none';
                img.addEventListener('load', checkImageLoad);
                frag.appendChild(img);
            };
        };
        document.body.appendChild(frag);
    },

    checkImageLoad = function() {
        loaded++;
        if(loaded === 14) {
            loadCallback();
        };
    },

    draw = function(ctx, posX, posY) {
        if(tiles.length === 0) {
            return false;
        };
        // determine the x and y coordinates of the top left corner
        var canvasOrigin = {
                pixels:{
                    x:posX - gameWindow.pixels.x / 2,
                    y:posY - gameWindow.pixels.y / 2
                }
            };

        // determine the first tile to draw (in the top left corner)
        canvasOrigin.tiles = {
            x:Math.floor(canvasOrigin.pixels.x / tilesize),
            y:Math.floor(canvasOrigin.pixels.y / tilesize)
        };
        // determine the offset in pixels since the player can occupy any position
        // and not just intervals of 40
        offset = {
            x:canvasOrigin.pixels.x % 40,
            y:canvasOrigin.pixels.y % 40
        };
        for(var y = 0; y < gameWindow.tiles.y + 1; y++) {
            for(var x = 0; x < gameWindow.tiles.x + 1; x++) {
                var tileNum = x + canvasOrigin.tiles.x + (y + canvasOrigin.tiles.y)*map.x;
                    image = document.getElementById(tiles[tileNum]);
                ctx.drawImage(image, x * tilesize - offset.x, y * tilesize - offset.y);
            };
        };
    };

    return {
        config:config,
        draw:draw,
        loadTiles:loadTiles
    };
    
});
