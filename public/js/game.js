var socket = app.getSocket();

// QUIZOO
socket.on('show house', function(data) {
    console.log(data);

    // reset divjes
    document.getElementById("answers").innerHTML = "";

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");

    // new data
    document.getElementById("question").innerText = data.Title;
    ["a", "b", "c", "d"].forEach(element => {
        var item = document.createElement('li');
        item.textContent = data.Information[element];
        document.getElementById("answers").appendChild(item);
    });

    // reset slider
    slider.value = 50;
});

socket.on('finish quiz', function(quizData) {
    document.getElementById("answers").innerHTML = "";
    document.getElementById("question").innerText = "Dat was het!";
});

if (output) {
    output.innerHTML = slider.value;
}

slider.oninput = function() {
    output.innerHTML = this.value;
}

function startQuiz() {
    var elem = document.getElementById("beginQuiz");
    if (elem){
        elem.parentNode.removeChild(elem);
    }

    socket.emit('start game');
}