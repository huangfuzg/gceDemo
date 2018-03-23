function draw(dom_id,nodes,links,community)
{
	d3.selectAll(dom_id+" > *").remove();
	//let nodes = Array.from(arg_nodes);
	//let links = Array.from(arg_links);
	//console.log(nodes === arg_nodes);
	var width = $(dom_id).width();
	var height = $(dom_id).height();
	var svg = d3.select(dom_id).append("g");
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
 	let zoom = d3.zoom().scaleExtent([1 / 2, 4]).on("zoom",zoomed);
 	svg.call(zoom);
	   let svg_nodes = svg.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		  .attr("cx", function(d) { return d.x; })
		  .attr("cy", function(d) { return d.y; })
		  .attr("r", 3000/nodes.length>8?8:3000/nodes.length)
		  .attr("fill", function(d,i){
		  	d.color = d[community] ? color(d[community][0]) : 'white';
			return d.color;
		});
		svg_nodes.call(d3.drag().on("start", dragstarted)//d3.drag() 创建一个拖曳行为
			  .on("drag", dragged)
			  .on("end", dragended));
		svg_nodes.on("click",(d,i)=>{
			$(".menu").css({left:d3.event.pageX,top:d3.event.pageY});
			$(".menu").data("nodeinfo",{nodeid:i,node:d,type:community});
			$(".menu").show();
			d3.event.stopPropagation();
		});
		 //添加描述节点的文字
		 // let svg_texts = svg.selectAll("text")
			//  .data(nodes)
			//  .enter()
			//  .append("text")
			//  .style("fill", "rgba(255,255,255,0)")
			//  .attr("dx", 20)
			//  .attr("dy", 8)
			//  .text(function(d){
			// 	return d.name;
			//  });
		simulation
		  .nodes(nodes)//设置力模拟的节点
		  .on("tick", ticked(svg_links,svg_nodes));
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
			 
				// svg_texts.attr("x", function(d){ return d.x; })
				//    .attr("y", function(d){ return d.y; });
			}
		}
		function zoomed()
		{
			svg.attr("transform", d3.event.transform);
		}
}

function circleCommunity(svg,nodes)
{
	let communities = new Map();
	nodes.forEach(node=>{
		node.community.forEach(com=>{
			if(communities.get(com) == undefined)
			{
				communities.set(com,{id:com,nodes:[],left:Infinity,right:0,top:Infinity,bottom:0});
			}
			// communities.get(com) = {nodes:[],left:Infinity,right:0,top:Infinity,bottom:0};
			communities.get(com).nodes.push(node);
			if(node.x<communities.get(com).left)
			{
				communities.get(com).left = node.x;
			}
			else if(node.x>communities.get(com).right)
			{
				communities.get(com).right = node.x;
			}
			if(node.y<communities.get(com).top)
			{
				communities.get(com).top = node.y;
			}
			else if(node.y>communities.get(com).bottom)
			{
				communities.get(com).bottom = node.y;
			}
		});
	});
	return communities;
}

function circleGceCommunity(svg,nodes)
{
	let gce_communities = new Map();
	nodes.forEach(node=>{
		node.gce_community.forEach(com=>{
			if(gce_communities.get(com) == undefined)
			{
				gce_communities.set(com,{id:com,nodes:[],left:Infinity,right:0,top:Infinity,bottom:0});
			}
			// communities.get(com) = {nodes:[],left:Infinity,right:0,top:Infinity,bottom:0};
			gce_communities.get(com).nodes.push(node);
			if(node.x<gce_communities.get(com).left)
			{
				gce_communities.get(com).left = node.x;
			}
			else if(node.x>gce_communities.get(com).right)
			{
				gce_communities.get(com).right = node.x;
			}
			if(node.y<gce_communities.get(com).top)
			{
				gce_communities.get(com).top = node.y;
			}
			else if(node.y>gce_communities.get(com).bottom)
			{
				gce_communities.get(com).bottom = node.y;
			}
		});
	});
	return gce_communities;
}
function similarityCommunity(nodes,original,general)
{
	let sim = new Map();
	nodes.forEach(node=>{
		node.community.forEach(com=>{
			node.gce_community.forEach(gce_com=>{
				let key1 = "com,"+com+','+"gce,"+gce_com;
				// let key2 = "gce,"+gce_com+','+"com,"+com;
				if(sim.get(key1) == undefined)
				{
					sim.set(key1,0);
					// sim.set(key2,0);
				}
				sim.set(key1,sim.get(key1)+1);
				// sim.set(key2,sim.get(key2)+1);
			});
		});
	});
	console.log(sim);
	return sim;
}
function correspondingCommunity(original,general,sim)
{
	for([key,value] of sim)
	{
		if(key.split(',')[0]=='com')
		{
			let o_key = +key.split(',')[1];
			let g_key = +key.split(',')[3];
			if(!original.get(o_key).respondCom)
			{
				original.get(o_key).respondCom = -1;
				original.get(o_key).respondComCommonNum = 0;
			}
			if(value>original.get(o_key).respondComCommonNum)
			{
				original.get(o_key).respondCom = g_key;
				original.get(o_key).respondComCommonNum = value;
			}
			if(!general.get(g_key).respondCom)
			{
				general.get(g_key).respondCom = -1;
				general.get(g_key).respondComCommonNum = 0;
			}
			if(value>general.get(g_key).respondComCommonNum)
			{
				general.get(g_key).respondCom = o_key;
				general.get(g_key).respondComCommonNum = value;
			}
		}
	}
}
function drawEclipe(dom_id,communities)
{
	svg = d3.select(dom_id+">g");
	let communities_arr = Array.from(communities.values());
	if(svg.selectAll(".ellipse").length>0)
	{
		updateEclipe(dom_id,communities)
	}
	else
	{
		svg.selectAll(".ellipse")
			.data(communities_arr)
			.enter()
			.append("ellipse")
			.attr("cx",com=>(com.left+com.right)/2)
			.attr("cy",com=>(com.top+com.bottom)/2)
			.attr("rx",com=>(com.right-com.left)/2+15)
			.attr("ry",com=>(com.bottom-com.top)/2+15)
			.attr("class","ellipse")
			.style("stroke","white")
			.style('stroke-width',0)
			.style("fill","none");
		svg.selectAll(".comlable")
			.data(communities_arr)
			.enter()
			.append("text")
			.attr("dx",com=>(com.left+com.right)/2)
			.attr("dy",com=>(com.top+com.bottom)/2)
			.attr("class","comlable")
			.style("fill", "rgba(255,255,255,0)")
			.style("font-size","20px")
			.text(com=>com.id);
	}
}
function updateEclipe(svg,communities)
{
	svg = d3.select(svg+">g");
	let communities_arr = Array.from(communities.values());
	svg.selectAll(".ellipse")
		.data(communities_arr)
		.update()
		.append("ellipse")
		.attr("cx",com=>(com.left+com.right)/2)
		.attr("cy",com=>(com.top+com.bottom)/2)
		.attr("rx",com=>(com.right-com.left)/2+15)
		.attr("ry",com=>(com.bottom-com.top)/2+15)
		.attr("class","ellipse")
		.style("stroke","white")
		.style('stroke-width',0)
		.style("fill","none");
	svg.selectAll(".comlable")
		.data(communities_arr)
		.update()
		.append("text")
		.attr("dx",com=>(com.left+com.right)/2)
		.attr("dy",com=>(com.top+com.bottom)/2)
		.attr("class","comlable")
		.style("fill", "rgba(255,255,255,0)")
		.style("font-size","20px")
		.text(com=>com.id);
}