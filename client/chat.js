module.define('chat', function() {

    var model = module.import('model'),

        sendMessage,
        chat = document.getElementById('chat'),
        chatBar = document.getElementById('chatBar'),
        chatHistory = document.getElementById('chatHistory'),

    use = function(event) {
        if(event.keyCode === 13) {
            event.preventDefault();
            if(document.activeElement === chatBar) {
                if(chatBar.value !== '') {
                    sendMessage('chat', chatBar.value);
                    chatBar.value = '';
                };
                document.body.focus();
                chatBar.style.display = 'none';
                model.chatting = false;
            }else{
                chatBar.focus();
                chatBar.style.display = 'block';
                model.chatting = true;
            };
        };
    },

    addToHistory = function(messages) {
        var frag = document.createDocumentFragment();
        for(var i = 0, ilen = messages.length; i < ilen; i++) {
            var div = document.createElement('div');
            div.innerHTML = messages[i];
            frag.appendChild(div);
        };
        chatHistory.appendChild(frag);
    },

    init = function(sender) {
        sendMessage = sender;
        model.chatting = false;
        chat.style.display = 'block';
        document.addEventListener('keypress', use);
    },

    destroy = function() {
        chat.style.display = 'none';
        document.removeEventListener('keypress', use);
    };

    return {
        init:init,
        destroy:destroy
    };

});
