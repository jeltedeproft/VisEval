/*this function starts the visualization process*/
function visualize(nodes){
	var g = new dagreD3.graphlib.Graph().setGraph({});

	// Add states to the graph
	for (var node of nodes){

		var key = node.timestamp.toString();
		var value = node.control;
		g.setNode(key,{ control: value});
	}

	// Add edges to the graph
	for (var node of nodes){
		var edges = node.edges;
		for (var edge of edges ){
			/*the edge with undefined is the edge of the last node, which should not be added*/
			if (typeof edge.node2name != 'undefined'){
				g.setEdge(edge.node1name.toString(),edge.node2name.toString(),{});
			}
		}
	}

	// Create the renderer
	var render = new dagreD3.render();

	// Set up an SVG group so that we can translate the final graph.
	var svg = d3.select("svg"), inner = svg.append("g");

	// Set up zoom support
	var zoom = d3.behavior.zoom().on("zoom", function() {
	    inner.attr("transform", "translate(" + d3.event.translate + ")" +
	                                "scale(" + d3.event.scale + ")");
	  });
	svg.call(zoom);


	// Run the renderer. This is what draws the final graph.
	render(inner, g);

	// Center the graph
	var initialScale = 0.75;
	zoom
	  .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
	  .scale(initialScale)
	  .event(svg);
	svg.attr('height', g.graph().height * initialScale + 40);
}