// our links and our nodes.
var linkpath = ("Edges.csv");
var nodepath = ("Nodes.csv");

var width = 1000, height = 600;

var color = d3.scale.category20();

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

// data stores
var storeNodes;
var storeLinks;

//Want to have different labels
// SETTING UP THE FORCE LAYOUT
var force = d3.layout.force()
        //using width/height from above, but size is mainly det'd by linkDistance and charge
        .size([width, height])
        // how far between nodes                         
        .linkDistance(80)
        // changes how close nodes will get to each other. Neg is farther apart.
        .charge(-300);

// filtered types
var typeFilterList = ['Romantic', 'Professional', 'Familial'];
$("#Filters").text(typeFilterList.join(" "));

// filter button event handlers
$(".toggle").on("click", function() {
    var id = $(this).attr("id");
    if (typeFilterList.includes(id)) {
    	typeFilterList.splice(typeFilterList.indexOf(id), 1);
    } else {
	typeFilterList.push(id);
    }
    
    filter();
    update();
});

// filter function
function filter() {
    console.log(typeFilterList);
    //	add and remove links from data based on type filters
    storeLinks.forEach(function(link) {
        link.filtered = false;
        typeFilterList.forEach(function(filter) {
            if (link.nature === filter ) {
                link.filtered = true;
                console.log(link.id + filter + " filtered")
            }
        });
    });
    
    $("#Filters").text(typeFilterList.join(" "));
}

// get our data
d3.csv(nodepath, function (nodes) {
    var nodelookup = {};
    var nodecollector = {};

    count = 0;
    // we want to create a lookup table that will relate the links file and the nodes file
    nodes.forEach(function (row) {
        nodelookup[row.Name] = count;

        nodecollector[row.Name] = {name: row.Name, group: row.Group};

//        console.log(nodecollector);
//        console.log(row.Name);
//        console.log(nodelookup);

        count++;
    });

    //Get all the links out of of the csv in a way that will match up with the nodes
    d3.csv(linkpath, function (linkchecker) {

        var linkcollector = {};
        indexsource = 0;
        indextarget = 0;
        count = 0;
        linkchecker.forEach(function (link) {
            linkcollector[count] = {
                id: link.ID,
                source: nodelookup[link.SName],
                target: nodelookup[link.TName],
                type: link.Type,
                nature: link.Nature,
                weight: link.Weight,
                desc: link.Description,
                filtered: false
            };
//            console.log(linkcollector[count]);
            count++;
        });

        var nodes = d3.values(nodecollector);
        var links = d3.values(linkcollector);

        console.log(nodes);
        console.log(links);
        
        storeNodes = nodes;
        storeLinks = links;
        
        update();
    });
});

// general update pattern for updating the graph
function update() {
    var nodes = storeNodes;
    var links = [];
    storeLinks.forEach(function(l) {
        if(l.filtered === false) {
            links.push(l);
        }
    });
    
    $("svg").empty();

    // Create the link lines.
    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", function (d) {
            return "link " + d.type;
        });

    // Create the node circles.
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    //put in little circles to drag
    node.append("circle")
        .attr("r", 4.5)
        .attr("class", function (d) {
            return "node " + d.group;
        })
        .call(force.drag);

    //add the words  
    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

    //get it going!
    force.nodes(nodes).links(links).start();

    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

        //I think that translate changes all of the x and ys at once instead of one by one?
        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });

    console.log("update");
    console.log(nodes);
    console.log(links);
}