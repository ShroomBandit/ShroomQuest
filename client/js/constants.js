spider.define(function () {

    return {

        images: {
            character: {
                _prefix: 'sprites/png/walkcycle/',
                _suffix: '.png',
                body: 'BODY_male',
                belt: 'BELT_rope',
                torso: 'TORSO_robe_shirt_brown',
                legs: 'LEGS_robe_skirt',
                hair: 'HEAD_hair_blonde',
                feet: 'FEET_shoes_brown'
            },
            map: {
                _prefix: 'tiles/',
                _suffix: '.png',
                _values: [
                    '0000',
                    '0001',
                    '0010',
                    '0011',
                    '0100',
                    '0110',
                    '0111',
                    '1000',
                    '1001',
                    '1011',
                    '1100',
                    '1101',
                    '1110',
                    '1111'
                ]
            }
        }

    }

});
