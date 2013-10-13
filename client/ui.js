spider.define('ui', function() {
	
        // chat vars
    var chat = document.getElementById('chat'),
        chatBar = document.getElementById('chatBar'),
        chatHistory = document.getElementById('chatHistory'),
        chatting = false,

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
        mapWidth, mapHeight,
        minimap = document.getElementById('minimap'),

        // player health and resource bar vars
        bars = {
            health:document.getElementById('healthbar'),
            resource:document.getElementById('resourcebar')
        },
        text = {
            health:bars.health.nextSibling,
            resource:bars.resource.nextSibling
        },

        // skill vars
        selectedSkill,
        skills = ['small', 'big', false, false, false, false, false, false, false, false],

        // warning box vars
        warningMessage,
        warningBox = document.getElementById('warning'),
        warningTimeout = false,

        // send method from socket will be passed in init()
        send,

    init = function(sender, offsetX, offsetY, width, height) {
        send = sender;
        for(var key in keymap) {
            pressed[key] = false;
        };
        addKeyEventListeners();
        addMouseEventListeners(offsetX, offsetY);
        mapWidth = width;
        mapHeight = height;
        selectSkill(1);
    },

    addKeyEventListeners = function() {
        document.addEventListener('keydown', function(event){
            if(event.keyCode in keymap && !pressed[event.keyCode]) {
                var key = keymap[event.keyCode];
                if(key === 'enter') {
                    event.preventDefault();
                    useChat();
                }else if(!chatting) {
                    pressed[event.keyCode] = true;
                    if('wasd'.indexOf(key) !== -1) {
                        send('keydown', key);
                    }else if(typeof key === 'number') {
                        selectSkill(key);
                    };
                };
            };
        });
        document.addEventListener('keyup', function(event){
            if(event.keyCode in keymap && !chatting) {
                pressed[event.keyCode] = false;
                if('wasd'.indexOf(keymap[event.keyCode]) !== -1) {
                    send('keyup', keymap[event.keyCode]);
                };
            };
        });
    },

    addMouseEventListeners = function(offsetX, offsetY) {
        document.addEventListener('mouseup', function(event) {
            //var button = ('which' in event) ? event.which : event.button;
            send('leftmouseup', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
        document.addEventListener('mousedown', function(event) {
            if(skills[selectedSkill]) {
                send('leftmousedown', {
                    x:event.clientX - offsetX,
                    y:event.clientY - offsetY,
                    skill:skills[selectedSkill]
                });
            }else{
                warn('That ability is not equipped.');
            };
        });
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            send('rightclick', {x:event.clientX - offsetX, y:event.clientY - offsetY});
        });
    },

    addToChatHistory = function(messages) {
        var frag = document.createDocumentFragment();
        for(var i = 0, ilen = messages.length; i < ilen; i++) {
            var div = document.createElement('div');
            div.innerHTML = messages[i];
            frag.appendChild(div);
        };
        chatHistory.appendChild(frag);
    },

    createMinimapPlayer = function(username) {
        var ele = document.createElement('div');
        ele.id = username;
        minimap.appendChild(ele);
    },

    keyPress = function(key) {
        if(typeof key === 'number') {
            selectSkill(key);
        }else{
        };
    },

    selectSkill = function(number) {
        if(typeof selectedSkill === 'number') {
            skillbar.children[selectedSkill].style.borderColor = '#000000';
        };
        selectedSkill = (number === 0) ? 9 : number-1;
        skillbar.children[selectedSkill].style.borderColor = '#f0e807';
    },

    setResource = function(data) {
        console.log(data);
        bars[data.bar].style.width = Math.round(data.current/data.max*100)+'%';
        text[data.bar].innerHTML = data.current+'/'+data.max;
    },

    useChat = function() {
        if(document.activeElement === chatBar) {
            if(chatBar.value !== '') {
                send('chat', chatBar.value);
                chatBar.value = '';
            };
            document.body.focus();
            chatBar.style.display = 'none';
            chatting = false;
        }else{
            chatBar.focus();
            chatBar.style.display = 'block';
            chatting = true;
        };
    },
    
    warn = function(message) {
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
    };

	return {
        addToChatHistory:addToChatHistory,
        init:init,
        setResource:setResource
	};

});
