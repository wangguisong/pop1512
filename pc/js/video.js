var bookid;
var currentUnitName;
var ccid;
var vid;
var videoName;

$(function(){
	ccid=getQuery("ccid");
	vid=getQuery("vid");
	
	bookid=getCookie("currentBookId");
	userID = getCookie("userID");
	webAppId = getCookie("webAppId");
	timeOffset = getCookie("timeOffset");
	appPwd= getCookie("appPwd");
	currentUnitName= getCookie("currentUnitName");
	
	$('.unitName').text(currentUnitName);
	getVideos ();
	
	$('.qrcode').mouseover(function(){
		$('.erweiDivPanel').show();
	});
	$('.qrcode').mouseout(function(){
		$('.erweiDivPanel').hide();
	});
})

/**二维码*/
function changeScanCode () {
	var container=document.getElementById("erweiDivPanelR");
	var qrcode = new QRCode(container, {
        width : 130,//设置宽高
        height : 100
    });
	var mobileHost = window.location.href.split('?')[0];
	mobileHost = mobileHost.replace('pc/video.html', 'mobile/index.html');
	var mobileUrl = mobileHost+"?userID="+userID+"&timeOffset="+timeOffset+"&action=0&actionId="+ccid;
	console.log(mobileUrl)
    qrcode.makeCode(mobileUrl);
}

function getVideos () {
	//请求数据
   request("ResourceService","getVideos",{bookid:bookid,unitName:currentUnitName},
       function(data){
       	var dataArr = data.data;
		if(dataArr != null && dataArr.length >0){
			//$(".list").empty();		
			for (var i = 0; i < dataArr.length; i++) {
				if(dataArr[i].type=="歌谣")
				{
					dataArr[i].type="geyao";
				}
				else if(dataArr[i].type=="单词")
				{
					dataArr[i].type="danci";
				}
				else if(dataArr[i].type=="语音")
				{
					dataArr[i].type="yuyin";
				}
				else if(dataArr[i].type=="对话")
				{
					dataArr[i].type="duihua";
				}
				else if(dataArr[i].type=="故事")
				{
					dataArr[i].type="gushi";
				}
			}
			setListData("#videoItemTmpl",".list",dataArr);	
			$(".videoItem").click(onClickVideoItem);
			setContent(ccid);
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
function onClickVideoItem(){
	ccid=$(this).attr("id");
	vid=$(this).attr("vid");
	setContent(ccid);
}
function setContent(ccid){	
	var listItems = $('.videoItem');	
	for(var i=0; i<listItems.length; i++){
		var domItem = listItems[i];
		if(ccid!=domItem.id){
			if($(domItem).hasClass('videoItemOn')){
				$(domItem).removeClass('videoItemOn');
			}
		}else{
			$(domItem).addClass('videoItemOn');
			videoName = $(domItem).children('.videoItemName').text();
		}
	}
	playVideo();
	changeScanCode();
}
/**播放视频播放*/
function playVideo(){
	if(ccid != 0){
		$("#jiema").hide();
		
		$(".playDiv div").remove();
		//var scriptl = $('<script id="scriptId" type="text/javascript" ><\/script>');
		$(".playDiv script").remove();
		//$(".playDiv").append('<script id="scriptId" type="text/javascript" ><\/script>');
	
		var dom = document.getElementById("playDiv");
		var sc = document.createElement("script");
		sc.setAttribute("type","text/javascript");
		sc.setAttribute("id","scriptId");
		dom.appendChild(sc);
	
		var url="http://union.bokecc.com/player?vid="+ccid+"&siteid=8B90641B41283EDC&autoStart=true&width=615&height=346&playerid=406D2DF0A2BD3485&playertype=1";
		$("#scriptId").attr("src",url);
		//var url="http://union.bokecc.com/player?vid="+ccid+"&siteid=8B90641B41283EDC&autoStart=true&width=740&height=416&playerid=406D2DF0A2BD3485&playertype=1";
		//$("#scriptId").attr("src",url);
		cc_js_Player.showPlayer();
		//var url="http://v.xdf.cn/videov.php?do=playerCode&playerType=JS&vid="+showid+"&autoStart=1&width=740&height=416&playerid=406D2DF0A2BD3485";
		//$("#iframe").attr("src",url);
	}else{
		$("#jiema").show();
	}
	
}


/*$(function(){
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
		$('.video').empty();
		var mp4 = document.createElement('source'); 
   		mp4.src = data.url; 
    		mp4.type= 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    		$('.video').append(mp4); 
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
*/