$.mylog = {};
$.mylog.log = function($dom,text,type,hide,time)
{
	console.log($dom);
	let b_color = "#000",
	color = "#fff",
	$div = $("<div class='my-log'></div>"),
	$i = $("<i></i>");
	if(type == "info")
	{
		b_color = "#17a2b8";
	}
	else if(type == "primary")
	{
		b_color = "#007bff";
	}
	else if(type == "warning")
	{
		b_color = "#ffc107";
	}
	else if(type == "danger")
	{
		b_color = "#dc3545";
	}
	$div.css({"padding": "2px 5px", "position": "absolute", "background-color": b_color, "color": color, "line-height": "2.0em", "border-radius": "5px"});
	$i.css({"border-top": "10px solid " + b_color, "border-right": "10px solid transparent", "border-left": "10px solid transparent", "position": "absolute", "bottom": "-10px", "left": "10px"});
	$div.append(text);
	$div.append($i);
	$("body").append($div);
	if($dom.css("position") == "static")
		$dom.css({"position":"relative"});
	let $dom_offset = $dom.offset();
	$div.css({"top":$dom_offset.top-$div.height()-13});
	$div.css({"left":$dom_offset.left});
	if(hide == true)
	{
		time = time || 1000;
		setTimeout(()=>{
			$div.fadeOut("fast","linear",()=>{$div.remove()});	
		},time);
	}
}