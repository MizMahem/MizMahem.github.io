// our links and our nodes.
var linkpath = ("Edges.csv");
var nodepath = ("Nodes.csv");

var width = 1000, height = 1000;
var baseSize = 10;
var sizeMult = 2;

var color = d3.scale.category20();

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
		.attr("id", "graph");

// data stores
var storeNodes;
var storeLinks;

// filters
var typeFilterList = [];
var minWeight = 1;
var maxWeight = 6;

//Want to have different labels
// SETTING UP THE FORCE LAYOUT
var force = d3.layout.force()
        //using width/height from above, but size is mainly det'd by linkDistance and charge
        .size([width, height])
        // how far between nodes                         
        .linkDistance(240)
        // changes how close nodes will get to each other. Neg is farther apart.
        .charge(-1200);

// formating
$(".toggle").button();

$("#weightFilterSlider").slider({
	range: true,
    values: [1, 6],
    min: 0,
    max: 6,
    step: 1,
    slide: function (event, ui) {
        $("#weightFilterDisp").val(ui.values.join(" - "));
        minWeight = ui.values[0];
		maxWeight = ui.values[1];
        filter();
        update();
    }
});

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
//    console.log(typeFilterList);
    //	add and remove links from data based on type filters
    storeLinks.forEach(function(link) {
        link.filtered = false;
        typeFilterList.forEach(function(filter) {
            if (link.nature === filter ) {
                link.filtered = true;
//                console.log(link.id + filter + " filtered")
            }
        });
        
        if (link.weight <= minWeight) {
            link.filtered = true;
        }
		if (link.weight >= maxWeight) {
            link.filtered = true;
        }
    });
    
    $("input#typeFiltersDisp").val(typeFilterList.join(" "));
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
            count++;
        });

        var nodes = d3.values(nodecollector);
        var links = d3.values(linkcollector);
        
        storeNodes = nodes;
        storeLinks = links;
        
        filter();
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
    
    $("svg#graph").empty();

    // Create the link lines.
    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", function (d) { return "link " + d.nature; })
        .attr("stroke-width", function(d) { return baseSize/2+(d.weight*sizeMult); });

    // Create the node circles.
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("id", function (d) {
            return d.name;
        })
        .call(force.drag);

    //get it going!
    force.nodes(nodes).links(links).start();

	// these calculations have to come after force because weight is not calculated till then.
	// link paths for labels
//	var linkPaths = svg.selectAll(".linkPath")
//		.data(links)
//		.enter().append('path')
//		.attr("id", function(d) { return "link"+d.id; })
//		.attr("d", function(d) { return ["M", d.source.x, d.source.y, "L", d.target.x, d.target.y].join(" "); });

	// link labels
	var linkLabels = svg.selectAll(".linkLabel")
		.data(links)
		.enter().append('text')
		.attr("class", "linkDesc")
//		.append('textPath')
//      .attr("xlink:href", function(d,i) { return "link"+i; })
		.text(function(d) { return d.desc; });

	//put in little circles to drag
	node.append("circle")
        .attr("r", function (d) { return baseSize+(d.weight*sizeMult); })
        .attr("class", function (d) { return ["node", d.group, "p"+d.name].join(" "); })
        .call(force.drag);

	//add the words  
    node.append("text")
        .attr("dx", function (d) {
			var offset = baseSize+(d.weight*sizeMult);
			return offset * 1.25; })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

	link.on("click", function(d) {
		console.log(d);
	});

    force.on("tick", function () {
        link
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        linkLabels
            .attr("x", function(d) { return ((d.source.x + d.target.x) / 2); })
            .attr("y", function(d) { return ((d.source.y + d.target.y) / 2); });

//		linkPaths.attr('d', function(d) { return  ["M", d.source.x, d.source.y, "L", d.target.x, d.target.y].join(" "); });

        //I think that translate changes all of the x and ys at once instead of one by one?
        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    });
}