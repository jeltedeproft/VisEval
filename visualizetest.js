var width = 960,
        height = 500;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var cola = cola.d3adaptor(d3)
        .linkDistance(100)
        .handleDisconnected(true)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    graph = {
    	nodes: [
	    	{name:'a'},
	    	{name:'b'},
	    	{name:'c'},
	    	{name:'d'},
	    	{name:'e'},
	    	{name:'f'},
	    	{name:'g'},
            {name:'h'},
            {name:'i'},
            {name:'h'},
	    	{name:'i'},

            {name:'j'},
            {name:'k'},
            {name:'l'},
            {name:'m'},
            {name:'n'},
            {name:'o'},
            {name:'p'},


	    ],
    	links: [
	    	{source:1, target:2},
    		{source:0, target:1},
            {source:0, target:2},
            {source:2, target:16},
    		{source:1, target:17},
            {source:16, target:15},
            {source:17, target:15},
            {source:14, target:15},
            {source:14, target:16},
            {source:14, target:16},
            {source:1, target:15},

    		{source:4, target:5},
    		{source:3, target:4},
    		{source:3, target:5},
            {source:13, target:3},
            {source:13, target:5},

            {source:8, target:9},
            {source:9, target:10},
            {source:8, target:10},
            {source:10, target:11},
            {source:11, target:12},
    		{source:12, target:10},

            {source:6, target:7},
    	]
    };

    // packing respects node width and height
    graph.nodes.forEach(function (v) { v.width = 90, v.height = 90 })

    cola
        .nodes(graph.nodes)
        .links(graph.links)
        .avoidOverlaps(true)
        .convergenceThreshold(1e-9)
        .handleDisconnected(true)
        .start(30, 0, 10); // need to obtain an initial layout for the node packing to work with by specifying 30 iterations here

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 3);

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", 45)
        .style("fill", function (d) { return color(d.group); })
        .call(cola.drag);

    node.append("title")
        .text(function (d) { return d.name; });

    cola.on("tick", function () {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
        cola.stop();
    });
