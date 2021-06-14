var ritaMarkov = RiTa.markov(4);
var text = new Array();
$.get("./data/anon-nibbles.txt", function (data) {
  ritaMarkov.addText(data.split('\n'));
});

function enable() {
    $("button").prop("disabled", false);
    $("button#Talk").click(talk);
    $("button#Clear").click(clear);
}

function talk() {
    var sentance = ritaMarkov.generateSentence();    
    $("p#Speech").append(sentance+"</br>");
}

function clear() {
    $("p#Speech").empty();
    console.log("bongo");
}

