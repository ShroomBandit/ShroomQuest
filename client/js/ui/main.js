spider.define(function (require) {

    var chat    = require('./chat'),
        Sync    = require('../../../shared/Sync'),

        // key event vars
        keymap = {
            '87':'w',
            '65':'a',
            '83':'s',
            '68':'d',
            '16':'shift',
            '13':'enter',
            '48':0,
            '49':1,
            '50':2,
            '51':3,
            '52':4,
            '53':5,
            '54':6,
            '55':7,
            '56':8,
            '57':9
        },
        pressed = {},

        // minimap vars
        mapWidth,
        mapHeight,
        minimap = document.getElementById('minimap'),

        // player health and resource bar vars
        bars = {
            health:     document.getElementById('healthbar'),
            resource:   document.getElementById('resourcebar')
        },
        text = {
            health:     bars.health.nextSibling,
            resource:   bars.resource.nextSibling
        },
        resourceChange = Sync('resources').change(setResource),

        // skill vars
        selectedSkill,
        skills = ['small', 'big', false, false, false, false, false, false, false, false],

        // mouse vars
        direction = 3,

        // warning box vars
        warningMessage,
        warningBox = document.getElementById('warning'),
        warningTimeout = false;

    function init(offsetX, offsetY, width, height) {
        for(var key in keymap) {
            pressed[key] = false;
        };
        addKeyEventListeners();
        //addMouseEventListeners(offsetX + (window.innerwidth-offsetX)/2, offsetY);
        addMouseEventListeners(offsetX, offsetY);
        mapWidth = width;
        mapHeight = height;
        selectSkill(1);
    }

    function addKeyEventListeners() {
        document.addEventListener('keydown', function (event){
            if (event.keyCode in keymap && !pressed[event.keyCode]) {
                var key = keymap[event.keyCode];

                // The enter key will trigger the chat window.
                if (key === 'enter') {
                    event.preventDefault();
                    chat.use();
                } else if (!chat.isChatting()) {
                    pressed[event.keyCode] = true;
                    // Send movement key notifications to the server.
                    if ('wasd'.indexOf(key) !== -1) {
                        send('keydown', key);
                    } else if (typeof key === 'number') {
                        selectSkill(key);
                    }
                }
            }
        });

        document.addEventListener('keyup', function (event){
            // Disregard keyup events when chatting.
            if (event.keyCode in keymap && !chat.isChatting()) {
                pressed[event.keyCode] = false;

                // Send movement key notifications to the server.
                if ('wasd'.indexOf(keymap[event.keyCode]) !== -1) {
                    send('keyup', keymap[event.keyCode]);
                }
            }
        });
    }

    function addMouseEventListeners(offsetX, offsetY) {
        document.addEventListener('mousemove', function (event) {
            var newDirection,
                relX = event.clientX - offsetX,
                relY = event.clientY - offsetY;

            if (relX >= relY) {
                // bottom-right side of line y = x
                if (relX >= Math.abs(relY)) {
                    newDirection = 4;
                } else {
                    newDirection = 1;
                }
            } else {
                // top-left side of line y = x
                if (Math.abs(relX) >= relY) {
                    newDirection = 2;
                } else {
                    newDirection = 3;
                }
            }
            console.log(relX, relY, newDirection);
            if (direction !== newDirection) {
                direction = newDirection;
                //send('changeDirection', direction);
            }
        });

        document.addEventListener('mouseup', function (event) {
            //var button = ('which' in event) ? event.which : event.button;
            send('leftmouseup', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
        document.addEventListener('mousedown', function (event) {
            if (skills[selectedSkill]) {
                send('leftmousedown', {
                    x:event.clientX - offsetX,
                    y:event.clientY - offsetY,
                    skill:skills[selectedSkill]
                });
            } else {
                warn('That ability is not equipped.');
            }
        });
        document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            send('rightclick', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
    }

    function createMinimapPlayer(username) {
        var ele = document.createElement('div');
        ele.id = username;
        minimap.appendChild(ele);
    }

    function keyPress(key) {
        if(typeof key === 'number') {
            selectSkill(key);
        }else{
        };
    }

    function selectSkill(number) {
        if(typeof selectedSkill === 'number') {
            skillbar.children[selectedSkill].style.borderColor = '#000000';
        };
        selectedSkill = (number === 0) ? 9 : number-1;
        skillbar.children[selectedSkill].style.borderColor = '#f0e807';
    }

    function setResource(data) {
        console.log(data);
        bars[data.bar].style.width = Math.round(data.current/data.max*100)+'%';
        text[data.bar].innerHTML = data.current+'/'+data.max;
    }

    function warn(message) {
        if(warningMessage !== message) {
            warningMessage = message;
        };
        if(!warningTimeout) {
            warningBox.innerHTML = warningMessage;
        }else{
            clearTimeout(warningTimeout);
        };
        warningTimeout = setTimeout(function() {
            warn('');
            warningTimeout = false;
        }, 2000);
    }

	return {
        init: init
	}

});
