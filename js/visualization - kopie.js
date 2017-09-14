/*this function starts the visualization process*/
function visualize(nodes,render){

	//remove listeners of old graph
	d3.select("svg").selectAll("*").on('click',null);
	//clear screen
	d3.select("svg").selectAll("*").remove();

	//camera variables
	var cameraX = null;
	var cameraY = null;

	var g = new dagreD3.graphlib.Graph().setGraph({});


	g.graph().transition = function transition(selection) { //transition with duration 1000ms
	    return selection.transition().duration(1000);
	};


	var visibleNodes = [];
	var fatarrow = false;

	// Add visible states to the graph
	for (var node of nodes){
		var key = node.position.toString();
		var controltype = node.control.controltype;
		var storage = node.storage;
		var visible = node.visibility;
		var makeArrowFat = fatarrow;
		var neighbours = node.edges;
		var visibleneighbours = [];

		if(visible){
			//first we check if the original neighbours are visible
			if (neighbours != null) {
				for (var i = 0; i < neighbours.length; i++) {
				    var nodeNeighbour = findNodeByIndex(neighbours[i].node2name);
				    if (nodeNeighbour.visibility == true) {
				    	visibleneighbours.push(nodeNeighbour);
				    };
				}
			};

			if(controltype == "ev"){
				var value = node.control.expression;
				var formattedlabel = controltype + " : " + value;
				g.setNode(key,{ label: formattedlabel, store: storage, connectednode:node, arrowtype:makeArrowFat, visibleConnected : visibleneighbours});
			}else if (controltype == "kont"){
				var value = node.control.expression;
				var formattedlabel = controltype + " : " + value;
				g.setNode(key,{ label: formattedlabel, store: storage, connectednode:node, arrowtype:makeArrowFat, visibleConnected : visibleneighbours});
			}else if (controltype == "call"){
				var value = node.control.expression + "(" + node.control.environment.toString() + ")";
				var formattedlabel = controltype + " : " + value;
				g.setNode(key,{ label: formattedlabel, store: storage, connectednode:node, arrowtype:makeArrowFat, visibleConnected : visibleneighbours});
			}else if (controltype == "return"){
				var value = node.control.expression + " --> " + node.control.environment;
				var formattedlabel = controltype + " : " + value;
				g.setNode(key,{ label: formattedlabel, store: storage, connectednode:node, arrowtype:makeArrowFat, visibleConnected : visibleneighbours});
			}
			visibleNodes.push(node);
			fatarrow = false;
		}else{
			fatarrow = true;
		}
	}

	//sort the visible nodes based on the position
	visibleNodes = sortNodesByPosition(visibleNodes);

	var nrVisibleNodes = Object.keys(visibleNodes).length;

	// link the visible nodes together now
	for (var i = 0; i < nrVisibleNodes - 1; i++) {
		var node1 = visibleNodes[i].position.toString();
		var node2 = visibleNodes[i + 1].position.toString();

		//if a node has multiple children, we have to deviate from the standard way of linking nodes up
		//we lookup the parent(s), see if its(they are) visible and if it (they) pass(es) these 2 conditions, link them up
		if (visibleNodes[i + 1].secondarynode == true) {
			var parents = visibleNodes[i + 1].parents;
			console.log(parents);
			console.log(parents.length);
			for (var j = 0; j < parents.length; j++) {
				console.log(j);
				if (findNodeByIndex(parents[j]).visibility == true) {
					console.log("visible");
					if (g.node(node2).arrowtype == true) {
						console.log("hidden nodes");
						g.setEdge(
							parents[j],
							node2,
							{style: "stroke: #f66; stroke-width: 3px; stroke-dasharray: 5, 5;", arrowheadStyle: "fill: #f66"});
					}else{
						console.log("geen hidden nodes");
						g.setEdge(parents[j],node2,{});
					}
				}
			}
		}else{
			if (g.node(node2).arrowtype == true) {
				g.setEdge(
					node1,
					node2,
					{style: "stroke: #f66; stroke-width: 3px; stroke-dasharray: 5, 5;", arrowheadStyle: "fill: #f66"});
			}else{
				g.setEdge(node1,node2,{});
			}
		}

		//a graph can have multiple edges, so now we are gna see if any of those need to be linked as well(only necesary if node 2 is visible)
		// console.log(g.node(node1));
		// console.log(g.node(node1).visibleConnected);
		// console.log(g.node(node1).visibleConnected.length);
		// if (g.node(node1).visibleConnected.length > 0) {
		// 	console.log("yes");
		// 	g.setEdge(node1,node2,{});
		// }; 	
	}
	// rounded corners
	g.nodes().forEach(function(v) {
	  var node = g.node(v);
	  node.rx = node.ry = 5;
	});

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

	//color the selected node and swap the selected node with the one from the previous graph
	//we also save the x and y coordinates from this node to center the camera around it
	g.nodes().forEach(function(v) {
		//clear any previous colors
		g.node(v).elem.style.color = "#000";
		g.node(v).elem.style.fill = "";
		if (selectedNodeID == v){
			g.node(v).elem.style.fill = "#22c";
			selectedGraphNode = g.node(v);
			cameraX = selectedNode.x;
			cameraY = selectedNode.y;
		};
	});

	//Center the graph, if we dont have a node selected, just centralize the whole graph, if we do have a node selected
	//then center around that node
	aspect = svg.attr("width") / svg.attr("height")
	parent = document.getElementById("righthalve");

	if (selectedNode == null) {
		zoom
		  .translate([parent.clientWidth / 2, 80])
	}else{
		zoom
		  .translate([parent.clientWidth / 2, 80])
	};

	//resize the graph when we resize the window
	window.addEventListener('resize', function(event) {
	    var targetWidth = parent.clientWidth;
	    svg.attr("width", targetWidth);
	    svg.attr("height", Math.round(targetWidth / aspect));
	});


	//we add a listener to every node, if its clicked, we display the environment(store)
	svg.selectAll("g.node").on("click", function(id) {

		//clear out environment
		document.getElementById("environment").innerHTML = "";

		//clear effects from previously selected node if there is one
		if (selectedGraphNode != null) {
			selectedGraphNode.elem.style.color = "#000";
			selectedGraphNode.elem.style.fill = "";
		};


		var _node = g.node(id);
		_node.elem.style.fill = "#22c";

		//define this node as the currently selected node 
		selectedNodeID =  id;
		selectedNode = _node.connectednode;
		selectedGraphNode = _node;

		if (selectedNode.control.controltype == "ev") {
			var environmentpanel = d3.select('environment');
			var storage = _node.store;
			var environment = selectedNode.control.environment;
			var propertystring = " ";

			for(var envElement in environment){
				for(var prop in storage){
					if (environment[envElement] == prop) {
						propertystring = propertystring + "<br>" + envElement + " = " + storage[prop];
						document.getElementById("environment").innerHTML = propertystring;
					};
				}
			}
		};
	});
	return g;
}
