$(function(){
	let $info = $("[data-myinfo]"), 
	$div = $("<div class='my-info'></div>"),
	$i = $("<i></i>");
	$div.css({"padding": "2px 5px", "position": "absolute", "background-color": "#000", "color": "#fff", "line-height": "2.0em", "border-radius": "5px"});
	$i.css({"border-top": "10px solid " + $div.css("background-color"), "border-right": "10px solid transparent", "border-left": "10px solid transparent", "position": "absolute", "bottom": "-10px", "right": "10px"});
	$div.append($info.data("myinfo"));
	$div.append($i);
	$info.append($div);
	if($info.css("position") == "static")
		$info.css({"position":"relative"});
	$div.css({"top":-$div.height()-10});
});
