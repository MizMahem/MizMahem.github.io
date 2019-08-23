var ritaMarkov = new RiMarkov(4);
ritaMarkov.loadFrom("./data/anon-nibbles.txt", enable);

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

