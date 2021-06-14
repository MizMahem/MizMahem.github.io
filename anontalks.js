var ritaMarkov = RiTa.markov(4);

function enable() {
    $.get("./data/anon-nibbles.txt", function (data) {
        ritaMarkov.addText(data.split('\n'));
        $("button").prop("disabled", false);
        $("button#Talk").click(talk);
        $("button#Clear").click(clear);
    });
}

function talk() {
    var sentance = ritaMarkov.generate();    
    $("p#Speech").append(sentance+"</br>");
}

function clear() {
    $("p#Speech").empty();
    console.log("bongo");
}

