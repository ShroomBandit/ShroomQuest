spider.define(function (require) {

    var Sync = require('../../shared/Sync'),

        map, gameWindow,
        tiles, tilesize,
        minimapX = 945,
        minimapY = 495,
        minimapWidth = 150,
        minimapHeight = 150;

    function config(width, height) {
        gameWindow = {
            pixels: {
                x: width,
                y: height
            },
            tiles: {
                x: Math.ceil(width / tilesize),
                y: Math.ceil(height / tilesize)
            }
        };
    }

    function draw(ctx, posX, posY, images) {
        if (tiles === undefined || tiles.length === 0) {
            return false;
        }
        
        // determine the x and y coordinates of the top left corner
        var canvasOrigin = {
                pixels: {
                    x: posX - gameWindow.pixels.x / 2,
                    y: posY - gameWindow.pixels.y / 2
                }
            };

        // determine the first tile to draw (in the top left corner)
        canvasOrigin.tiles = {
            x: Math.floor(canvasOrigin.pixels.x / tilesize),
            y: Math.floor(canvasOrigin.pixels.y / tilesize)
        };
        // determine the offset in pixels since the player can occupy any position
        // and not just intervals of 40
        offset = {
            x:canvasOrigin.pixels.x % 40,
            y:canvasOrigin.pixels.y % 40
        };
        for (var y = 0; y < gameWindow.tiles.y + 1; y++) {
            for (var x = 0; x < gameWindow.tiles.x + 1; x++) {
                var tileNum = x + canvasOrigin.tiles.x + (y + canvasOrigin.tiles.y)*map.x;
                /*    img = new Image();
                img.src = '/images/tiles/' + tiles[tileNum] + '.png';
                img.onload = function() {ctx.drawImage(img, x * tilesize - offset.x, y * tilesize - offset.y); console.log('hi')};*/
                ctx.drawImage(images[tiles[tileNum]], x * tilesize - offset.x, y * tilesize - offset.y);
            }
        }
    }

    function minimap(ctx, playerData) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(minimapX, minimapY, minimapWidth, minimapHeight);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        for (var player in playerData) {
            var x = Math.round(playerData[player].x / map.width * minimapWidth),
                y = Math.round(playerData[player].y / map.height * minimapHeight);
            ctx.arc(minimapX + x, minimapY + y, 2, 0, Math.PI*2, false);
        }
        ctx.fill();
    }

    Sync.create('map').change(function (mapData) {
        console.log(mapData);
        // mapData must have the properties:
        //   width, height, tiles, tilesize
        tiles = mapData.tiles;
        tilesize = mapData.tilesize;
        // width and height are passed as number of pixels
        map = {
            x:      mapData.width/tilesize,
            y:      mapData.height/tilesize,
            width:  mapData.width,
            height: mapData.height
        };
    });

    return {
        config:     config,
        draw:       draw,
        minimap:    minimap
    }

});
