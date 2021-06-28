var ritaMarkov = RiTa.markov(2);
enable();

function enable() {
    $.get("./data/non-acts.txt", function (data) {
        ritaMarkov.addText(shuffle(data.split('\n')).slice(0,1000));
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

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}