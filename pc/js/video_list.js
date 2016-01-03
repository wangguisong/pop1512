var server = 'asset/';
var unitArr;
$(function(){
	$.ajax(server+"video_list.data").success(function(data){
		unitArr = eval("("+data+")");
		unitArr.forEach(function(uItem){
			var item = $("<a href='javascript:void(0)'><div class='navItem'>"+uItem.title+"</div></a>");
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
		$('.unitTitle').html(parseTitle(data.title));
		$('.list').empty();
		data.videos.forEach(function(item){
			var videoItem = $("<a href='video.html' target='_blank'><div class='videoItem'><img class='videoIcon' src='"+
				item.cover+"'/><div class='videoTitle'>"+
				item.title+"</div><div class='arrow'></div><img class='videoTip' src='"+
				getIconByType(item.type)+"'/></div></a>");
			$('.list').append(videoItem);
		})
	}
	
	function getIconByType(type){
		return "img/type"+type+".png";
	}
	
	function parseTitle(txt){
		var arr = txt.split(" ");
		var num = arr[arr.length-1];
		var isNum = true;
		for(var i=0; i<num.length; i++){
			var n = num.charAt(i);
			if(n<'0' || n>'9'){
				isNum = false;
				break;
			}
		}
		var ret="";
		for(var i=0; i<arr.length-1; i++){
			ret += arr[i];
			ret += " ";
		}
		if(isNum){
			ret += ('<span style="color:#1fb3ae;">'+num+'<span>');
		}else{
			ret += num;
		}
		return ret;
	}
})
