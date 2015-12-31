var server = 'http://182.92.0.115/pop/';

$(function(){
	$.ajax(server+"index.data").success(function(data){
		var obj = eval("("+data+")");
		var vArr = obj.videos;
		vArr.forEach(function(vItem){
			var v = $("<div class='item'><a class='itemIcon' href='http://www.baidu.com' target='_blank'><img src='"+
				vItem.icon+"'></img></a><div class='itemTitle'>"+vItem.title+"</div></div>");
			$('.videoContainer').append(v);
		});
		var aArr = obj.audios;
		aArr.forEach(function(aItem){
			var v = $("<div class='item'><a href='http://www.baidu.com' target='_blank'><img class='itemIcon' src='"+
				aItem.icon+"'></img></a><div class='itemTitle'>"+aItem.title+"</div></div>");
			$('.audioContainer').append(v);
		});
	});
	
	$("#close").click(function(){
		closeWindow();
	})
});
