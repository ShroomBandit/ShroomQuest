module.define('view/map', function() {
    
    var map, gameWindow,
        loaded = 0,
        tiles = [],
        tilesize = 40,

    initialize = function(mapx, mapy, gameWindowx, gameWindowy) {
        // width and height are passed as number of pixels
        if(mapx % tilesize !== 0 || mapy % tilesize !== 0) {
            throw new Error('Map dimensions must be multiples of ' + tilesize);
            return false;
        };
        map = {
            x:mapx/tilesize,
            y:mapy/tilesize
        };
        gameWindow = {
            pixels:{x:gameWindowx, y:gameWindowy},
            tiles:{
                x:Math.ceil(gameWindowx/tilesize),
                y:Math.ceil(gameWindowy/tilesize)
            }
        };
        loadTileImages();
    },

    loadTileImages = function() {
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

    checkImageLoad = function(event) {
        loaded++;
        if(loaded === 14) {
            generate();
        };
    },

    generate = function() {
        for(var y = 0; y < map.y; y++) {
            for(var x = 0; x < map.x; x++) {
                var left, top,
                    newTile = [],
                    tileNum = x + y * (map.x);
                if(y !== 0) {
                    top = tiles[tileNum - map.x];
                    newTile[0] = top.charAt(3);
                    newTile[1] = top.charAt(2);
                };
                if(x !== 0) {
                    left = tiles[tileNum - 1];
                    if(typeof newTile[1] === 'undefined') {
                        newTile[1] = left.charAt(0);
                    };
                    newTile[2] = left.charAt(3);
                };
                for(var i = 0; i < 4; i++) {
                    if(typeof newTile[i] === 'undefined') {
                        newTile[i] = Math.round(Math.pow(Math.random(), 2)).toString();
                    };
                };
                newTile = newTile.join('');
                if(newTile === '0101') {
                    newTile = '0100';
                }else if(newTile === '1010') {
                    newTile = '1011';
                };
                tiles[tileNum] = newTile;
            };
        };
    },

    draw = function(ctx, centerX, centerY) {
        if(tiles.length === 0) {
            return false;
        };
        var offset = {
                pixels:{
                    x:centerX - gameWindow.pixels.x / 2,
                    y:centerY - gameWindow.pixels.y / 2
                }
            };

        offset.tiles = {
            x:Math.floor(offset.pixels.x / tilesize),
            y:Math.floor(offset.pixels.y / tilesize)
        };
        for(var y = 0; y < gameWindow.tiles.y; y++) {
            for(var x = 0; x < gameWindow.tiles.x; x++) {
                var tileNum = x + offset.tiles.x + (y + offset.tiles.y)*map.x;
                    image = document.getElementById(tiles[tileNum]);
                ctx.drawImage(image, x * tilesize - (offset.pixels.x % 40), y * tilesize - (offset.pixels.y % 40));
            };
        };
    };

    return {
        initialize:initialize,
        draw:draw
    };
    
});
