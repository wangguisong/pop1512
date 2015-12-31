var server = 'http://182.92.0.115/pop/';
var unitArr;
$(function(){
	$.ajax(server+"video_list.data").success(function(data){
		unitArr = eval("("+data+")");
		unitArr.forEach(function(uItem){
			var item = $("<a class='navItem' href='javascript:void(0)'>"+uItem.title+"</a>");
			$('.navigator').append(item);
			item.click(function(evt){
				setContent(unitArr.indexOf(uItem));
			});
		});
		if(unitArr.length>0){
			setContent(0);
		}
	});
	
	function setContent(index){
		var navs = $('.navItem');
		for(var i=0; i<navs.length; i++){
			var domNav = navs[i];
			if(index!=i){
				if($(domNav).hasClass('navOn')){
					$(domNav).removeClass('navOn');
				}
			}else{
				$(domNav).addClass('navOn');
			}
		}
		var data = unitArr[index];
		$('.container.title').html(data.title);
		$('.list').empty();
		data.videos.forEach(function(item){
			var videoItem = $("<a href='http://www.baidu.com'><div class='videoItem'><img class='videoIcon' src='"+
				item.cover+"'/><div class='videoTitle'>"+
				item.title+"</div><div class='arrow'></div><img class='videoTip' src='"+
				getIconByType(item.type)+"'/></div></a>");
			$('.list').append(videoItem);
		})
	}
	
	function getIconByType(type){
		return "img/type"+type+".png";
	}
})
