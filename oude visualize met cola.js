/*this function starts the visualization process*/
function visualize(allnodes){

	var width = 960,
	    height = 500;

	var nodes = [];
	var links = [];

	var color = d3.scaleOrdinal(d3.schemeCategory20);

	var d3cola = cola.d3adaptor()
	    .linkDistance(30)
	    .size([width, height]);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	nodes.forEach(function (v) {
		//store the node in the array called "nodes"
		nodes.push({expression: v.control});

		var edges = v.edges;

		edges.forEach(function (e) {
			//store all of the edges coming from this node into the array called "links"
			links.push({source:e.node1name, target:e.node2name});
		});
	});


	d3cola
	    .nodes(nodes)
	    .links(links)
	    .avoidOverlaps(true)
	    .convergenceThreshold(1e-9)
	    .handleDisconnected(true)
	    //.start(30, 0, 10); // need to obtain an initial layout for the node packing to work with by specifying 30 iterations here

	var link = svg.selectAll(".link")
	    .data(links)
	  .enter().append("line")
	    .attr("class", "link")
	    .style("stroke-width", 3);

	var node = svg.selectAll(".node")
	    .data(nodes)
	  .enter().append("circle")
	    .attr("class", "node")
	    .attr("r", 45)
	    .style("fill", function (d) { return color(d.group); })
	    //.call(cola.drag);

	node.append("title")
	    .text(function (d) { return d.name; });

	d3cola.on("tick", function () {
	    link.attr("x1", function (d) { return d.source.x; })
	        .attr("y1", function (d) { return d.source.y; })
	        .attr("x2", function (d) { return d.target.x; })
	        .attr("y2", function (d) { return d.target.y; });

	    node.attr("cx", function (d) { return d.x; })
	        .attr("cy", function (d) { return d.y; });
	    d3cola.stop();
	});
}