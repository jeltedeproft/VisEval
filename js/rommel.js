for (var i = 0; i < incomingEdges.length; i++) {
	graph.removeEdge(incomingEdges[i].v,pos);
};
graph.removeNode(pos);