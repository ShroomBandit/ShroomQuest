spider.define(function (require) {

    var chat    = require('./chat'),
        Sync    = require('Sync'),

        // minimap vars
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
        resourceChange = Sync.create('resources', {}, {watch: true, silently:true}).on('change', setResource),

        // skill vars
        selectedSkill,
        skills = ['small', 'big', false, false, false, false, false, false, false, false],

        // mouse vars
        direction = 3,

        // warning box vars
        warningMessage,
        warningBox = document.getElementById('warning'),
        warningTimeout = false;

    function init() {
        selectSkill(1);
    }

    function createMinimapPlayer(username) {
        var ele = document.createElement('div');
        ele.id = username;
        minimap.appendChild(ele);
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
        init: init,
        selectSkill: selectSkill
	}

});
