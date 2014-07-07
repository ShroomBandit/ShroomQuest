spider.define(function (require) {

    var Sync    = require('Sync'),

        chatBar     = document.getElementById('chatBar'),
        chatHistory = document.getElementById('chatHistory'),
        chatting    = false,
        newChats    = Sync.create('newChats', [], {watch: true, silently:true}).on('change', addToHistory);

    function addToHistory(messages) {
        var div,
            frag = document.createDocumentFragment();

        for (var i = 0; i < messages.length; i++) {
            div = document.createElement('div');
            div.innerHTML = messages[i];
            frag.appendChild(div);
        }

        chatHistory.appendChild(frag);
    }

    function isChatting() {
        return chatting;
    }

    function use() {
        if (document.activeElement === chatBar) {
            if (chatBar.value !== '') {
                newChats.set(chatBar.value);
                chatBar.value = '';
            }

            document.body.focus();
            chatBar.style.display = 'none';
            chatting = false;
        } else {
            chatBar.focus();
            chatBar.style.display = 'block';
            chatting = true;
        }
    }

    return {
        isChatting: isChatting,
        use:        use
    }

});
