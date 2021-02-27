var app = (function() { 
    var socket = io();
    return {
        getSocket: function() { return socket;}
    }
})();