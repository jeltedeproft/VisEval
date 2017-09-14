//we're stepping inside a function call
function NextNode(){
	var start = +new Date();
	var Nodes = nodes;
	var graph = VisualGraph;
	var renderer = render;
	var currentNodeIndex = selectedNodeID;
	var currentNode = selectedNode;
	var graphnode = selectedGraphNode;
	var lastnumber = Object.keys(nodes).length - 1;
	var edges = currentNode.edges;

	if ((currentNode.position != lastnumber) && (graphnode != null)){
		for (var i = 0; i < edges.length; i++) {
			var nextNode = findNodeByIndex(parseInt(edges[i].node2name));
			nextNode.visibility = true;

			selectedNodeID = nextNode.position;
			selectedNode = nextNode;
		}

		/*initialize visualization*/
		VisualGraph = visualize(Nodes,render);

		selectedGraphNode = VisualGraph.node(nextNode.position.toString());
	}
	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to next node = " + diff);
}

function StepBack(){
	var start = +new Date();
	var Nodes = nodes;
	var graph = VisualGraph;
	var renderer = render;
	var currentNodeIndex = selectedNodeID;
	var currentNode = selectedNode;
	var graphnode = selectedGraphNode;
	var incEdges = currentNode.incomingedges;

	if ((currentNode.position != 0) && (graphnode != null)){
		currentNode.visibility = false;
		for (var i = 0; i < incEdges.length; i++) {
			var previousNode = findNodeByIndex(parseInt(incEdges[i]));

			selectedNodeID = previousNode.position;
			selectedNode = previousNode;
		}

		/*initialize visualization*/
		VisualGraph = visualize(Nodes,render);

		selectedGraphNode = VisualGraph.node(previousNode.position.toString());
	}
	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to step back = " + diff);
}

function StepOver(){
	var start = +new Date();
	var Nodes = nodes;
	var graph = VisualGraph;
	var renderer = render;
	var currentNodeIndex = parseInt(selectedNodeID);
	var currentNode = selectedNode;
	var graphnode = selectedGraphNode;
	var currentNesting = currentNode.control.nesting;
	var edges = currentNode.edges;
	var visitednodes = [currentNode.position];

	if (edges != null) {
		for (var i = 0; i < edges.length; i++) {
			var child = edges[i].node2name;
			visitednodes.push(child);
			currentNode = findNodeByIndex(parseInt(child));
			currentNode.visibility = false;
			currentNodeIndex = child;

			//found a loop or a node at the far end?
			if ((!CheckDoubles(child,visitednodes)) || (edges == null)){
				//do nothing, this branch is cleared
			}else{
				if (currentNode.control.controltype != "call") {
					checkBranchForCallNode(child,visitednodes);
				} else{
					currentNode.visibility = true;
					checkBranchForReturnNode(child,visitednodes,currentNode.control.nesting);
				};
			}
		}
	}
	VisualGraph = visualize(Nodes,render);
	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to step over = " + diff);
}

function StepOut(){
	var start = +new Date();
	var graph = VisualGraph;
	var currentNodeIndex = parseInt(selectedNodeID);
	var currentNode = selectedNode;
	var currentNesting = currentNode.control.nesting;

	//calculate nesting level of scope we're currently in
	if (currentNesting == 0) {
		alert("can't step out, we're inside the global scope");
	}else{
		graph.nodes().forEach(function(v) {
			//check every visualized node if it is inside the same scope
			var visualizednode = findNodeByIndex(parseInt(v));
			if (visualizednode.control.nesting == currentNesting) {
				visualizednode.visibility = false;
				console.log(v);
				console.log("current nesting = " + currentNesting);
				console.log("nesting of node = " + visualizednode.control.nesting);
			}
		});
	}
	VisualGraph = visualize(nodes,render);
	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to step out = " + diff);
}

function checkBranchForCallNode(nodename,visitedNodes){
	var Nodes = nodes;
	var graph = VisualGraph;
	var currentNodeIndex = parseInt(nodename);
	var currentNode = findNodeByIndex(currentNodeIndex);
	var currentNesting = currentNode.control.nesting;
	var edges = currentNode.edges;
	var visitednodes = visitedNodes;

	if (edges != null) {
		for (var i = 0; i < edges.length; i++) {
			var child = edges[i].node2name;
			visitednodes.push(child);
			currentNode = findNodeByIndex(parseInt(child));
			currentNode.visibility = false;
			currentNodeIndex = child;

			//found a loop or a node at the far end?
			if ((!CheckDoubles(child,visitednodes)) || (edges == null)){
				//do nothing, this branch is cleared
			}else{
				if (currentNode.control.controltype != "call") {
					checkBranchForCallNode(child,visitednodes);
				} else{
					currentNode.visibility = true;
					checkBranchForReturnNode(child,visitednodes,currentNode.control.nesting);
				};
			}
		}
	}
}

function checkBranchForReturnNode(nodename,visitedNodes,nesting){
	var Nodes = nodes;
	var graph = VisualGraph;
	var currentNodeIndex = parseInt(nodename);
	var currentNode = findNodeByIndex(currentNodeIndex);
	var currentNesting = currentNode.control.nesting;
	var edges = currentNode.edges;
	var visitednodes = visitedNodes;

	if (edges != null) {
		for (var i = 0; i < edges.length; i++) {
			var child = edges[i].node2name;
			visitednodes.push(child);
			currentNode = findNodeByIndex(parseInt(child));
			currentNode.visibility = false;
			currentNodeIndex = child;

			//found a loop or a node at the far end?
			if ((!CheckDoubles(child,visitednodes)) || (edges == null)){
				//do nothing, this branch is cleared
			}else{
				if ((currentNode.control.controltype == "return") && (currentNode.control.nesting == nesting)){
					currentNode.visibility = true;
					selectedNodeID = currentNodeIndex;
					selectedNode = currentNode;
				} else{
					checkBranchForReturnNode(child,visitednodes,nesting);
				};
			}
		}
	};
}

function CollapseNodes(){
	var start = +new Date();
	var Nodes = nodes;
	var currentNodeIndex = selectedNodeID;
	var currentNode = selectedNode;
	var graphnode = selectedGraphNode;
	var lastnumber = Object.keys(nodes).length - 1;

	if ((currentNodeIndex >= 0) && (graphnode != null)){
		// check if the position = 0 or = max
		for (var node of Nodes){
			var number = node.position;
			if (number > currentNodeIndex){
				node.visibility = false;
			}
		}
	};

	/*visualize*/
	VisualGraph = visualize(Nodes,render);
	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to collapse = " + diff);
}

function ShowFullGraph(){
	var start = +new Date();
	var Nodes = nodes;

	for (var node of Nodes){
		node.visibility = true;
	}
	/*visualize*/
	scale = 1;
	translate = [0,0];
	VisualGraph = visualize(Nodes,render);

	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to showfullgraph = " + diff);
}

function Reset(){
	var start = +new Date();
	var Nodes = nodes;
	var lastnumber = Object.keys(nodes).length - 1;

	// check if the position = 0 or = max
	for (var node of Nodes){
		var number = node.position.toString();
		if (number == 0 || number == lastnumber){
			node.visibility = true;
		}
		else{
			node.visibility = false;
		}
	}
	
	/*visualize*/
	scale = 1;
	translate = [0,0];
	VisualGraph = visualize(Nodes,render);

	var end = +new Date();
	var diff = end - start;
	console.log("the difference in time to reset = " + diff);
}

function showInformation(element){
	var doc = document.getElementById('popup');
	doc.style.display = 'block';

	if (element == "nextnode") {
		doc.innerHTML = "this function allows you to show the next node(s) relative to the currently selected node";
	}else if (element == "stepback"){
		doc.innerHTML = "this function allows you to hide the currently selected node";
	}else if (element == "stepover"){
		doc.innerHTML = "this function skips to the next function call and then skips again to its return node " + 
						"effectively skipping over the next function call";
	}else if (element == "stepout"){
		doc.innerHTML = "this function hides everything that is part of the same scope" + 
						"effectively abandoning the current function call";
	}else if (element == "collapsenodes"){
		doc.innerHTML = "this function allows you to collapse all nodes after the currently selected one" +
						"(All nodes with a higher node number).";
	}else if (element == "showfullgraph"){
		doc.innerHTML = "this function allows you to show the complete graph";
	}else if (element == "reset"){
		doc.innerHTML = "this function allows you to reset the graph to its original state." +
						"Only showing the begin and end nodes.";
	};
}

function removePopup(){
	var doc = document.getElementById('popup');
	doc.style.display = 'none';
}