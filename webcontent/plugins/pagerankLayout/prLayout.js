function prLayout(nodes,edges,edges_weight)
{
	let _nodes,
		_edges,
		_edges_w,
		_size = [1,1],
		_epoch = 10,
		_min_change = 0.1, 
		layout = function(){}; 
	if(edges_weight&&edges_weight.length!==edges.length)
		throw new Error("第二个参数必须和第一个参数长度一致");
	_nodes = nodes||[];
	_edges = edges||[];
	_edges_w = edges_weight || edges.map(edge=>1);
	layout.prototype.nodes = function(nodes)
	{
		_nodes = nodes;
		return this;
	}
	layout.prototype.edges = function(edges)
	{
		_edges = edges;
		return this;
	}
	layout.prototype.edgesWeight = function(edges_w)
	{
		_edges_w = edges_w;
		return this;
	}
	layout.prototype.size = function(size)
	{
		_size = size;
		return this;
	}
	layout.prototype.epoch = function(epoch)
	{
		_epoch = epoch;
		return this;
	}
	layout.prototype._init = function()
	{
		let x_gap = _size[0] / _nodes.length,
			y_gap = _size[1] / _nodes.length,
			x_start = 0,
			y_start = 0;
		_edges.forEach(edge=>{
			edge.source.degree = edge.source.degree || 0;
			edge.target.degree = edge.target.degree || 0;
			edge.source.degree++;
			edge.target.degree++;
		});
		_nodes.forEach((node,i)=>{
			node.x = x_start + i * x_gap;
			node.y = y_start + i * y_gap;
			node.
		});
	}
	return layout();
}