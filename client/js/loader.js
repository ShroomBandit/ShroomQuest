spider.define(function (require) {

    var constants = require('./constants'),

        handleLoaderFinish = function () {},
        images = JSON.parse(JSON.stringify(constants.images)),

        counts = {
            loaded: 0,
            total: 0
        };

    function checkImageLoad() {
        counts.loaded++;
        step();
        if (counts.loaded === counts.total) {
            handleLoaderFinish();
        }
    }

    function loadImage(obj, name, src) {
        counts.total++;
        obj[name] = new Image();
        obj[name].onload = checkImageLoad;
        obj[name].src = '/client/images/' + src;
    }

    function loadImageSet(imageSet) {
        var prefix = imageSet._prefix || '',
            suffix = imageSet._suffix || '';

        function generateSrc(imageName) {
            return prefix + imageName + suffix;
        }

        if ('_values' in imageSet) {
            imageSet._values.forEach(function (imageName) {
                loadImage(imageSet, imageName, generateSrc(imageName), checkImageLoad);
            });
        } else {
            for (var imageKey in imageSet) {
                if (imageKey !== '_prefix' && imageKey !== '_suffix') {
                    loadImage(imageSet, imageKey, generateSrc(imageSet[imageKey]), checkImageLoad);
                }
            }
        }
    }

    function findImageSets(obj) {
        var randomKey = Object.keys(obj).pop();
        if (typeof obj[randomKey] === 'object' && !Array.isArray(obj[randomKey])) {
            for(var key in obj) {
                findImageSets(obj[key]);
            }
        } else {
            loadImageSet(obj);
        }
    }

    function start(callback) {
        findImageSets(images);
        //setup progress bar
        handleLoaderFinish = callback;
    }

    function step() {
        //update progress bar
    }

    return {
        start: start,
        images: images
    }
});
