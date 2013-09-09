module.define('chat', function() {

    var model = module.import('model'),
        socket = module.import('socket'),

        chat = document.getElementById('chat'),
        chatBar = document.getElementById('chatBar'),
        chatHistory = document.getElementById('chatHistory');

    model.chatting = false;
        
    var use = function(event) {
        if(event.keyCode === 13) {
            event.preventDefault();
            console.log('enter pressed');
            console.log(document.activeElement);
            if(document.activeElement === chatBar) {
                if(chatBar.value !== '') {
                    socket.send('chat', chatBar.value);
                    chatBar.value = '';
                };
                document.body.focus();
                chatBar.style.display = 'none';
                model.chatting = false;
            }else{
                chatBar.focus();
                chatBar.focus();
                chatBar.style.display = 'block';
                model.chatting = true;
            };
        };
    },

    enable = function() {
        chat.style.display = 'block';
        document.addEventListener('keypress', use);
    },

    disable = function() {
        chat.style.display = 'none';
        document.removeEventListener('keypress', use);
    };

    return {
        enable:enable,
        disable:disable
    };

});
