var ritaMarkov = RiTa.markov(2);
enable();

function enable() {
    $.get("./data/non-acts.txt", function (data) {
        ritaMarkov.addText(data.split('\n'));
        $("button").prop("disabled", false);
        $("button#Talk").click(talk);
        $("button#Clear").click(clear);
    });
}

function talk() {
  $("#Speech").append(`<li>${ritaMarkov.generate()}</li>`);
}

function clear() {
    $("#Speech").empty();
    console.log("bongo");
}

