/* This function extracts the nodes
		
	node object components:
	---label
	---control
	---store
	---kstore
	---kont
	---time
	---position
	---connected edges  ==> this is an array of all connected edges [[1,"i'm edge 1"],[2,"i'm edge 2"]]

	assumption : edges and nodes array are equal in size
*/
function disassembleStates(executionTraceObject) {
	var allNodes = executionTraceObject.nodes;
	var allEdges = executionTraceObject.edges;
	var nrNodes = Object.keys(allNodes).length;
	var nrEdges = Object.keys(allEdges).length;

	//if (nrNodes == (nrEdges + 1)){
		var States = [];
		var arrivingedges = [];

		//initialize array of incoming edges
		for (var k = 0; k < nrEdges + 1; k++) { 
			arrivingedges[k] = [];
		}

		/*loop trough all nodes except the last one */
		for (var i = 0; i < nrEdges; i++) { 
			var node = allNodes[i];
			var edges = allEdges[i];
			var edgeobjects = createEdgeObjects(i,edges);

			//add the predecessors of the node
			if(edgeobjects != null){
				for (var edgeobject of edgeobjects ){
					/*the edge with undefined is the edge of the last node, which should not be added*/
					if (typeof edgeobject.node2name != 'undefined'){
						arrivingedges[i].push(edgeobject.node1name); 
					}
				}
			} 

			//actually create the objects representing the nodes
		    States[i] = new state(
		    	node.label,
		    	node.control,
		    	node.store,
		    	node.kstore,
		    	node.kont,
		    	node.time,
		    	i,
		    	edgeobjects,
		    	arrivingedges[i], //this represents the incoming edges 
		    	false) 
		}

		/*there is 1 extra node compared to the edges, because the last node does not have successors*/
		var j = nrEdges;   /*edges start counting from 0, so the number at the end of the for loop is +1 the number of edges */
		var node = allNodes[j];
		var edgeobjects = createEdgeObjects(j,[[]]);

		//add the predecessors of the node
		if(edgeobjects != null){
			for (var edgeobject of edgeobjects ){
				/*the edge with undefined is the edge of the last node, which should not be added*/
				if (typeof edgeobject.node2name != 'undefined'){
					arrivingedges[j].push(edgeobject.node1name); 
				}
			}
		} 
		//create nodes
		States[j] = new state(
			node.label,
		    node.control,
		    node.store,
		    node.kstore,
		    node.kont,
		    node.time,
		    j,
		    edgeobjects,/*empty edges for the last node*/
		    arrivingedges,
		    false) 

		/*return all states*/
		return States;
	//} else {
	//	alert("nodes and edges need to be equal in size");
	//	return false;
	//}
}

function createEdgeObjects(nodeA,arrayOfEdges){
	var nredges = Object.keys(arrayOfEdges).length;
	var edgeobjects = [];
	for (var i = 0; i < nredges; i++) {
		edgeobjects[i] = new edge(nodeA,arrayOfEdges[i]);
	}
	return edgeobjects;
}

function state(label,control,store,kstore,kont,time,position,edgeobjects,incomingEdges,visibility){
	this.label = label;

	if(control.type == "ev"){
		this.control = new Control(
			control.type,
			control.exp,
			control.env);
	}else if(control.type == "kont"){
		this.control = new Control(
			control.type,
			control.value);
	}

	this.storage = store;
	this.kstore = kstore;
	this.kont = kont;
	this.timestamp = time;
	this.position = position;
	this.edges = edgeobjects;
	this.incomingedges = incomingEdges;
	this.visibility = visibility;
	return this;
}



function Control(type,exp,env){
	this.controltype = type;
	if(type == "ev"){
		this.expression = exp;
		this.environment = env;
		return this;
	}
	else if(type == "kont"){
		this.expression = exp;
		return this;
	}
}

function edge(nodeA,nodeBarray){
	this.node1name = nodeA
	this.node2name = nodeBarray[0];
	return this;
}
