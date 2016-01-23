var bookid;
//var server="http://10.200.23.123:80/WebTemplet/file/";

var audioArr;
var oldTimeX;
var oldX;
var audio = new Audio();
audio.autoplay = true;

$(function(){
	bookid=getQuery("id");
	userID = getCookie("userID");
	webAppId = getCookie("webAppId");
	timeOffset = getCookie("timeOffset");
	appPwd= getCookie("appPwd");
	
	setCookie("currentBookId",bookid);
	
	document.getElementsByClassName('container')[0].appendChild(audio);
	getAudios();
	
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
		$(".playPause").addClass('audioStatePlay');
		
		var cur = getPlayedIndex();
		var next = findNextSelected(cur);
		if(next >= 0){
			var aid = $($('.audioPlay')[next]).attr('id');
			setContent(aid);
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
	
	$('.volumnThumb').mousedown(function(evt){
		oldX = evt.clientX;
		document.addEventListener('mousemove', mousemove);
		document.addEventListener('mouseup', mouseup);
	})
	
	$('.timeThumb').mousedown(function(evt){
		oldX = evt.clientX;
		document.addEventListener('mousemove', mousemovetime);
		document.addEventListener('mouseup', mouseuptime);
	})
	
	$('.prev').click(function(){
		var cur = getPlayedIndex();
		if(cur>0){
			var aid = $($('.audioPlay')[cur-1]).attr('id');
			setContent(aid);
		}
	});
	
	$('.next').click(function(){
		var cur = getPlayedIndex();
		var next = findNextSelected(cur);
		if(next >= 0){
			var aid = $($('.audioPlay')[next]).attr('id');
			setContent(aid);
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
	
	$('.allPlay').click(function(evt){
		var list = $('.audioItemCheck');
		for(var i=0; i<list.length; i++){
			if(list[i].checked){
				var aid = $($('.audioPlay')[i]).attr('id');
				setContent(aid);
				break;
			}
		}
	});
})

function getAudios() {
	//请求数据
   request("ResourceService","getAudios",{bookid:bookid},
       function(data){
       	var dataArr = data.data;
		if(dataArr != null && dataArr.length >0){
			//$(".list").empty();	
			audioArr=dataArr;
			for (var i = 0; i < dataArr.length; i++) {
				dataArr[i].path=server+dataArr[i].path;
				dataArr[i].num=i;
				if(i%2==0)
				{
					dataArr[i].className="audioItemA";
				}
				else
				{
					dataArr[i].className="audioItemB";
				}
			}
			setListData("#audioItemTmpl",".container",dataArr);	
			$(".audioItem").dblclick(function(evt){
				var aid=$(this).find(".audioPlay").attr("id");
				setContent(aid);
			});
			$('.audioPlay').click(function(evt){
				setContent(this.id);
			});
			$('audioItemCheck').change(function(evt){
				checkAllChecked();
			});
			$('.audioMore').mouseover(function(evt){
				var mx = evt.pageX;
				var my = evt.pageY;
				changeScanCode();
				var x = mx-436;
				var y = my-66;
				if(y<44){
					y = 44;
				}
				$('.erweiDivPanel').css('right','100px');
				$('.erweiDivPanel').css('top', y+'px');
				$('.erweiDivPanel').show();
			});
			$('.audioMore').mouseout(function(){
				$('.erweiDivPanel').hide();
			});
			var list = $('.audioItemCheck');
			for(var i=0; i<list.length; i++){
				list[i].checked = true;
			}
			setContent(audioArr[0].id);
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}

	function getAudioById (aid) {
		for (var i = 0; i < audioArr.length; i++) {
			if(audioArr[i].id==aid){
				return audioArr[i];
			}
		}
		return null;
	}
	
	function setContent(aid){
		var listItems = $('.audioItem');
		for(var i=0; i<listItems.length; i++){
			var domItem = listItems[i];
			var flag = domItem.getElementsByClassName('audioPlaying');
			if(aid!=$(domItem).find(".audioPlay").attr("id")){
				if($(domItem).hasClass('audioItemOn')){
					$(domItem).removeClass('audioItemOn');
				}
				$(flag).hide();
			}else{
				$(domItem).addClass('audioItemOn');
				$(flag).show();
			}
		}
		var data = getAudioById(aid);
		$('.playedTitle').text(data.name);
		audio.src = data.path;
		var mp3 = document.createElement('source'); 
   		mp3.src = data.path; 
    		mp3.type= 'audio/mpeg'; 
    		audio.appendChild(mp3); 
    
		audio.load();
		setVolume();
		var domItem = $("#"+aid).parent();
		var tTop = $(domItem).offset().top-$('.container').offset().top;
		var pos = $('.container').scrollTop();
		if(tTop<0){
			$('.container').scrollTop(pos+tTop);
		}else if(tTop+$(domItem).height() > $('.container').height()){
			var dis = tTop+$(domItem).height()-$('.container').height();
			$('.container').scrollTop(dis+pos);
		}	
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
		try{
			audio.currentTime = t;
		}catch(e){
			console.log(e.message)
		}
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
	
	function findNextSelected(from){
		var ret = -1;
		if(from<$('.audioItem').length-1){
			for(var i=from+1; i<$('.audioItem').length; i++){
				var checked = $('.audioItemCheck')[i].checked;
				if(checked){
					ret = i;
					break;
				}
			}
		}
		return ret;
	}
	
	/**二维码*/
	function changeScanCode (aid) {
		var container=document.getElementById("erweiDivPanelR");
		var qrcode = new QRCode(container, {
	        width : 130,//设置宽高
	        height : 100
	    });
	    qrcode.makeCode('http://182.92.0.115/mobile/index.html?'+"id="+aid);
	}
	
