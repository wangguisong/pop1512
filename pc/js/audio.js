var audioArr;
var audio = new Audio();
audio.autoplay = true;

$(function(){
	$.ajax("asset/audio.data").success(function(data){
		audioArr = eval("("+data+")");
		audioArr.forEach(function(aItem){
			var item = $('<div class="audioItem">\
					<input type="checkbox" class="audioItemCheck"/>\
					<div class="audioNum">'+
					formatNum(audioArr.indexOf(aItem))+'</div>\
					<img class="audioPlaying" src="" />\
					<div class="audioTitle">'+
					aItem.title+'</div>\
					<div class="button audioPlay"></div>\
					<div class="button audioMore"></div>\
				</div>');
			$('.container').append(item);
			item.dblclick(function(evt){
				setContent(audioArr.indexOf(aItem));
			});
		});
		if(audioArr.length>0){
			setContent(0);
		}
	});
	
	function formatNum(num){
		var ret = "";
		if(num<10) ret += "0";
		ret += num;
		return ret;
	}
	
	function setContent(idx){
		var listItems = $('.audioItem');
		for(var i=0; i<listItems.length; i++){
			var domItem = listItems[i];
			if(idx!=i){
				if($(domItem).hasClass('audioItemOn')){
					$(domItem).removeClass('audioItemOn');
				}
			}else{
				$(domItem).addClass('audioItemOn');
			}
		}
		var data = audioArr[idx];
		audio.src = data.url;
		audio.load();
		setVolume();
	}
	
	$('.playPause').click(function(evt){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});
	
	var oldVolume;
	$('#btnVolumn').click(function(evt){
		if(audio.volume!=0){
			oldVolume = audio.volume;
			audio.volume = 0;
		}else{
			if(oldVolume==0 || oldVolume==undefined) oldVolume = 0.5;
			audio.volume = oldVolume;
		}
	});
	
	audio.onplay = function(evt){
		if($(".playPause").hasClass('audioPlay')){
			$(".playPause").removeClass('audioPlay');
		}
		$(".playPause").addClass('audioPause');
	}
	
	audio.onpause = function(evt){
		if($(".playPause").hasClass('audioPause')){
			$(".playPause").removeClass('audioPause');
		}
		$(".playPause").addClass('audioPlay');
	}
	
	audio.ondurationchange = function(evt){
		$(".timeDesTotal").text(formatTime(evt.currentTarget.duration));
	}
	
	audio.ontimeupdate = function(evt){
		$(".timeDesPlayed").text(formatTime(evt.currentTarget.currentTime));
		var v = audio;
		var w = $('.timeLine').width();
		var ww = v.currentTime/v.duration*w;
		$('.timePlayed').css('width', ww+"px");
	}
	
	audio.onended = function(evt){
		audio.currentTime = 0;
		audio.pause();
		if($(".playPause").hasClass('audioPause')){
			$(".playPause").removeClass('audioPause');
		}
		$(".playPause").addClass('audioPlay');
	}
	
	audio.onvolumechange = function(evt){
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
		var v = audio.volume;
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
		audio.volume = v;
	}
	
	function mouseup(evt){
		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('mouseup', mouseup);
	}
})