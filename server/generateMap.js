/** @module */

'use strict';

/**
 * Generate a map.
 * @param {number} width
 * @param {number} height
 * @returns {array}
 */
module.exports = function(width, height) {
    var tiles = [];
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var left, top,
                newTile = [],
                tileNum = x + y * (width);
            if(y !== 0) {
                top = tiles[tileNum - width];
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
    return tiles;
};
