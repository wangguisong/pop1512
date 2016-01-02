var audioArr;
var audio = new Audio();
audio.autoplay = true;

$(function(){
	$.ajax("asset/audio.data").success(function(data){
		audioArr = eval("("+data+")");
		var odd = false;
		audioArr.forEach(function(aItem){
			var item = $('<div class="audioItem '+(odd ? 'audioItemB' : 'audioItemA')+'">\
					<input type="checkbox" class="audioItemCheck"/>\
					<div class="audioNum">'+
					formatNum(audioArr.indexOf(aItem))+'</div><div class="audioDes">\
					<img class="audioPlaying" src="img/a_played.png" />\
					<div class="audioTitle">'+
					aItem.title+'</div></div>\
					<div class="button audioPlay"></div>\
					<div class="button audioMore"></div>\
				</div>');
			$('.container').append(item);
			item.dblclick(function(evt){
				setContent(audioArr.indexOf(aItem));
			});
			$(item[0].getElementsByClassName('audioPlay')).click(function(evt){
				setContent(audioArr.indexOf(aItem));
			});
			$(item[0].getElementsByClassName('audioItemCheck')).change(function(evt){
				checkAllChecked();
			});
			odd = !odd;
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
			var flag = domItem.getElementsByClassName('audioPlaying');
			if(idx!=i){
				if($(domItem).hasClass('audioItemOn')){
					$(domItem).removeClass('audioItemOn');
				}
				$(flag).hide();
			}else{
				$(domItem).addClass('audioItemOn');
				$(flag).show();
			}
		}
		var data = audioArr[idx];
		$('.playedTitle').text(data.title);
		audio.src = data.url;
		audio.load();
		setVolume();
		var domItem = listItems[idx];
		var tTop = $(domItem).offset().top-$('.container').offset().top;
		var pos = $('.container').scrollTop();
		if(tTop<0){
			$('.container').scrollTop(pos+tTop);
		}else if(tTop+$(domItem).height() > $('.container').height()){
			var dis = tTop+$(domItem).height()-$('.container').height();
			$('.container').scrollTop(dis+pos);
		}	
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
		if($(".playPause").hasClass('audioStatePlay')){
			$(".playPause").removeClass('audioStatePlay');
		}
		$(".playPause").addClass('audioStatePause');
	}
	
	audio.onpause = function(evt){
		if($(".playPause").hasClass('audioStatePause')){
			$(".playPause").removeClass('audioStatePause');
		}
		$(".playPause").addClass('audioStatePlay');
	}
	audio.onloadeddata = function(evt){
		$(".timeDesTotal").text(formatTime(evt.currentTarget.duration));
	}
	audio.ondurationchange = function(evt){
		$(".timeDesTotal").text(formatTime(evt.currentTarget.duration));
	}
	
	audio.ontimeupdate = function(evt){
		$(".timeDesPlayed").text(formatTime(evt.currentTarget.currentTime));
		var v = audio;
		var w = $('.timeLine').width();
		var ww = v.currentTime/v.duration*w;
		$('.timeTrack').css('width', ww+"px");
		var l = parseInt($('.timeLine').css('left'));
		var ll = l+ww-9;
		$('.timeThumb').css('left', ll+'px');
	}
	
	audio.onended = function(evt){
		audio.currentTime = 0;
		audio.pause();
		if($(".playPause").hasClass('audioStatePause')){
			$(".playPause").removeClass('audioStatePause');
		}
		$(".playPause").addClass('audioPlay');
		
		var cur = getPlayedIndex();
		if(cur<$('.audioItem').length-1){
			setContent(cur+1);
		}
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
	
	var oldTimeX;
	$('.timeThumb').mousedown(function(evt){
		oldX = evt.clientX;
		document.addEventListener('mousemove', mousemovetime);
		document.addEventListener('mouseup', mouseuptime);
	})
	
	function mousemovetime(evt){
		var x = evt.clientX;
		var thumbX = parseInt($('.timeThumb').css('left'));
		var newX = thumbX + (x-oldTimeX);
		oldTimeX = x;
		var minX = parseInt($('.timeLine').css('left'))-9;
		var maxX = parseInt($('.timeLine').css('left'))+$('.timeLine').width()-9;
		if(newX<minX){
			newX = minX;
		}
		if(newX>maxX){
			newX = maxX;
		}
		$('.timeThumb').css('left', newX+'px');
		var v = (newX-minX)/(maxX-minX);
		var w = $('.timeLine').width();
		var ww = v*w;
		$('.timeTrack').css('width', ww+"px");
		var t = parseFloat(v*audio.duration);
		audio.currentTime = t;
	}
	
	function mouseuptime(evt){
		document.removeEventListener('mousemove', mousemovetime);
		document.removeEventListener('mouseup', mouseuptime);
	}
	
	function getPlayedIndex(){
		var list = $('.audioItem');
		for(var i=0; i<list.length; i++){
			if($(list[i]).hasClass('audioItemOn')){
				return i;
			}
		}
		return -1;
	}
	
	$('.prev').click(function(){
		var cur = getPlayedIndex();
		if(cur>0){
			setContent(cur-1);
		}
	});
	
	$('.next').click(function(){
		var cur = getPlayedIndex();
		if(cur<$('.audioItem').length-1){
			setContent(cur+1);
		}
	});
	
	$('#all').change(function(){
		if($('#all')[0].checked){
			var list = $('.audioItemCheck');
			for(var i=0; i<list.length; i++){
				list[i].checked = true;
			}
		}else{
			var list = $('.audioItemCheck');
			for(var i=0; i<list.length; i++){
				list[i].checked = false;
			}
		}
	});
	
	function checkAllChecked(){
		var isAllChecked = true;
		var list = $('.audioItemCheck');
		for(var i=0; i<list.length; i++){
			if(!list[i].checked){
				isAllChecked = false;
			}
		}
		if(isAllChecked){
			$('#all')[0].checked = true;
		}else{
			$('#all')[0].checked = false;
		}
	}
	
	$('.allPlay').click(function(evt){
		var list = $('.audioItemCheck');
		for(var i=0; i<list.length; i++){
			if(list[i].checked){
				setContent(i);
				break;
			}
		}
	});
})