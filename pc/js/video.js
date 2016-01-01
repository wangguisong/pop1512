var videoArr;

$(function(){
	$.ajax("asset/video.data").success(function(data){
		var obj = eval("("+data+")");
		videoArr = obj.videos;
		$('.unitName').text(obj.title);
		videoArr.forEach(function(vItem){
			var item = $("<a href='javascript:void(0)'>\
						<div class='videoItem'>\
							<img class='videoItemIcon' src='"+
							vItem.icon+"'></img>\
							<div class='videoItenMask'></div>\
							<div class='videoItemName'>"+
							vItem.title+"</div>\
							<img class='videoItemTip' src='"+
							getIconByType(vItem.type)+"'/>\
						</div>\
					</a>");
			$('.list').append(item);
			item.click(function(evt){
				setContent(videoArr.indexOf(vItem));
			});
		});
		if(videoArr.length>0){
			setContent(0);
		}
	});
	
	function setContent(idx){
		var listItems = $('.videoItem');
		for(var i=0; i<listItems.length; i++){
			var domItem = listItems[i];
			if(idx!=i){
				if($(domItem).hasClass('videoItemOn')){
					$(domItem).removeClass('videoItemOn');
				}
			}else{
				$(domItem).addClass('videoItemOn');
			}
		}
		var data = videoArr[idx];
		$('.video').prop('src', data.url);
		setVolume();
	}
	
	function getIconByType(type){
		return "img/v_type"+type+".png";
	}
	
	$('#btnPlayPause').click(function(evt){
		if($('.video')[0].paused){
			$('.video')[0].play();
		}else{
			$('.video')[0].pause();
		}
	});
	
	$('.fullscreen').click(function(evt){
		var element = $('.video')[0];
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.msRequestFullscreen){
			element.msRequestFullscreen();
		} else if(element.oRequestFullscreen){
			element.oRequestFullscreen();
		}
		else if(element.webkitRequestFullscreen){
			element.webkitRequestFullScreen();
		}
	});
	
	var oldVolume;
	$('#btnVolumn').click(function(evt){
		if($('.video')[0].volume!=0){
			oldVolume = $('.video')[0].volume;
			$('.video')[0].volume = 0;
		}else{
			if(oldVolume==0 || oldVolume==undefined) oldVolume = 0.5;
			$('.video')[0].volume = oldVolume;
		}
	});
	
	$('.video')[0].onplay = function(evt){
		if($("#btnPlayPause").hasClass('videoPlay')){
			$("#btnPlayPause").removeClass('videoPlay');
			$("#btnPlayPause").addClass('videoPause');
		}
	}
	
	$('.video')[0].onpause = function(evt){
		if($("#btnPlayPause").hasClass('videoPause')){
			$("#btnPlayPause").removeClass('videoPause');
			$("#btnPlayPause").addClass('videoPlay');
		}
	}
	
	$('.video')[0].ondurationchange = function(evt){
		$(".timeDesTotal").text(formatTime(evt.currentTarget.duration));
	}
	
	$('.video')[0].ontimeupdate = function(evt){
		$(".timeDesPlayed").text(formatTime(evt.currentTarget.currentTime));
		var v = $('.video')[0];
		var w = $('.timeLine').width();
		var ww = v.currentTime/v.duration*w;
		$('.timePlayed').css('width', ww+"px");
	}
	
	$('.video')[0].onended = function(evt){
		$('.video')[0].currentTime = 0;
		$('.video')[0].pause();
		if($("#btnPlayPause").hasClass('videoPause')){
			$("#btnPlayPause").removeClass('videoPause');
			$("#btnPlayPause").addClass('videoPlay');
		}
	}
	
	$('.video')[0].onvolumechange = function(evt){
		if(evt.currentTarget.volume==0){
			if($('#btnVolumn').has('volumnOn')){
				$('#btnVolumn').removeClass('volumnOn');
			}
			$('#btnVolumn').addClass('volumnOff');
		}else{
			if($('#btnVolumn').has('volumnOff')){
				$('#btnVolumn').removeClass('volumnOff');
			}
			$('#btnVolumn').addClass('volumnOn');
		}
		setVolume();
	}
	
	function formatTime(time){
		time = parseInt(time);
		var sec = parseInt(time%60);
		var min = parseInt(time/60);
		var ret = "";
		if(min<10){
			ret += "0";
		}
		ret += min;
		ret += ":";
		if(sec<10){
			ret += "0";
		}
		ret += sec;
		return ret;
	}
	
	function setVolume(){
		var v = $('.video')[0].volume;
		var w = $('.volumnLine').width();
		var ww = v*w;
		$('.volumnTrack').css('width', ww+"px");
		var l = parseInt($('.volumnLine').css('left'));
		var ll = l+ww-6;
		$('.volumnThumb').css('left', ll+"px");
	}
	
	var oldX;
	$('.volumnThumb').mousedown(function(evt){
		oldX = evt.clientX;
		document.addEventListener('mousemove', mousemove);
		document.addEventListener('mouseup', mouseup);
	})
	
	function mousemove(evt){
		var x = evt.clientX;
		var thumbX = parseInt($('.volumnThumb').css('left'));
		var newX = thumbX + (x-oldX);
		oldX = x;
		var minX = parseInt($('.volumnLine').css('left'))-6;
		var maxX = parseInt($('.volumnLine').css('left'))+$('.volumnLine').width()-6;
		if(newX<minX){
			newX = minX;
		}
		if(newX>maxX){
			newX = maxX;
		}
		$('.volumnThumb').css('left', newX+'px');
		var v = (newX-minX)/(maxX-minX);
		$('.video')[0].volume = v;
	}
	
	function mouseup(evt){
		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('mouseup', mouseup);
	}
})
