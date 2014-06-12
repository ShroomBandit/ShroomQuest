spider.define(function (require) {

    var images = {};

    function loadImages(callback) {
        var bin,
            loadedImages = 0;

        images.map = {};

        function checkImageLoad() {
            loadedImages++;
            if (loadedImages === 21) {
                callback();
            }
        }

        for (var i = 0; i < 16; i++) {
            if (i !== 5 && i !== 10) {
                bin = ('000' + i.toString(2)).slice(-4);
                images.map[bin] = new Image();
                images.map[bin].onload = checkImageLoad;
                images.map[bin].src = '/client/images/tiles/' + bin + '.png';
            }
        }

        images.character = {};
        images.character.body = new Image();
        images.character.body.onload = checkImageLoad;
        images.character.body.src = '/client/images/sprites/png/walkcycle/BODY_male.png';
        images.character.belt = new Image();
        images.character.belt.onload = checkImageLoad;
        images.character.belt.src = '/client/images/sprites/png/walkcycle/BELT_rope.png';
        images.character.torso = new Image();
        images.character.torso.onload = checkImageLoad;
        images.character.torso.src = '/client/images/sprites/png/walkcycle/TORSO_robe_shirt_brown.png';
        images.character.legs = new Image();
        images.character.legs.onload = checkImageLoad;
        images.character.legs.src = '/client/images/sprites/png/walkcycle/LEGS_robe_skirt.png';
        images.character.hair = new Image();
        images.character.hair.onload = checkImageLoad;
        images.character.hair.src = '/client/images/sprites/png/walkcycle/HEAD_hair_blonde.png';
        images.character.head = new Image();
        images.character.head.onload = checkImageLoad;
        images.character.head.src = '/client/images/sprites/png/walkcycle/HEAD_robe_hood.png';
        images.character.feet = new Image();
        images.character.feet.onload = checkImageLoad;
        images.character.feet.src = '/client/images/sprites/png/walkcycle/FEET_shoes_brown.png';
    }

    return {
        images:     images,
        loadImages: loadImages
    }
});
