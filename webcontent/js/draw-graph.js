function draw(dom_id,nodes,links,community)
{
	d3.selectAll(dom_id+" > *").remove();
	//let nodes = Array.from(arg_nodes);
	//let links = Array.from(arg_links);
	//console.log(nodes === arg_nodes);
	var width = $(dom_id).width();
	var height = $(dom_id).height();
	var svg = d3.select(dom_id);
	// 通过布局来转换数据，然后进行绘制
	let simulation = d3.forceSimulation(nodes)
		  .force("link", d3.forceLink(links).distance(-nodes.length*nodes.length/500/10))
		  .force("charge",d3.forceManyBody())//创建多体力
		  .force("center",d3.forceCenter(width/2, height/2));


	simulation.force("link")//添加或移除力
		.links(links);//设置连接数组
	var color = d3.scaleOrdinal(d3.schemeCategory10); 
	// 绘制
	let svg_links = svg.selectAll("line")
		.data(links)
		.enter()
		.append("line")
		.style("stroke",d=>{
			return d.source[community] ? color(d.source[community][0]) : 'white';
		})
		.style("stroke-width",0.5*500/nodes.length)
		.call(d3.zoom()//创建缩放行为
			.scaleExtent([-5, 2])//设置缩放范围
		);
 
	   let svg_nodes = svg.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		  .attr("cx", function(d) { return d.x; })
		  .attr("cy", function(d) { return d.y; })
		  .attr("r", 3000/nodes.length>8?8:3000/nodes.length)
		  .attr("fill", function(d,i){
			return d[community] ? color(d[community][0]) : 'white';
		}).call(d3.drag().on("start", dragstarted)//d3.drag() 创建一个拖曳行为
			  .on("drag", dragged)
			  .on("end", dragended));
		 //添加描述节点的文字
		 let svg_texts = svg.selectAll("text")
			 .data(nodes)
			 .enter()
			 .append("text")
			 .style("fill", "rgba(255,255,255,0)")
			 .attr("dx", 20)
			 .attr("dy", 8)
			 .text(function(d){
				return d.name;
			 });
		simulation
		  .nodes(nodes)//设置力模拟的节点
		  .on("tick", ticked(svg_links,svg_nodes,svg_texts));
	   function dragstarted(d) {
		  if (!d3.event.active) simulation.alphaTarget(0.1).restart();//设置目标α
		  d.fx = d.x;
		  d.fy = d.y;
		}

		function dragged(d) {
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d.fx = null;
		  d.fy = null;
		}
		function ticked(svg_links,svg_nodes,svg_texts) {
			return function()
			{
				svg_links.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

				svg_nodes.attr("cx", function(d) {return d.x; })
					.attr("cy", function(d) { return d.y; });
			 
				svg_texts.attr("x", function(d){ return d.x; })
				   .attr("y", function(d){ return d.y; });
			}
		}
}