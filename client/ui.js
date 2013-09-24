module.define('ui', function(){
	
	var bars = {
            health:document.getElementById('healthbar'),
            resource:document.getElementById('resourcebar')
        },
        text = {
            health:bars.health.nextSibling,
            resource:bars.resource.nextSibling
        },

    setResource = function(data) {
        console.log(data);
        bars[data.bar].style.width = Math.round(data.current/data.max*100)+'%';
        text[data.bar].innerHTML = data.current+'/'+data.max;
    };

	return {
        setResource:setResource
	};

});
