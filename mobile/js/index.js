//验证参数
var userID;
var webAppId;
var timeOffset;
var serverIp;

var bookList;

var audioArr;
var audio = new Audio();
audio.autoplay = true;

var videoArr;
var videoMainData;
var curBookId;
var curVideoUnits;
var curVideoUnitIndex;

function layoutAudioMain(){
	var w = $(window).width();
	$('.audioMainCover').css('left', (w-168)/2+'px');
	$('.audioMainPlayPause').css('left', (w-64)/2+'px');
}

$(document).ready(function(){
	layoutAudioMain();
	userID = getQuery("userID");
	webAppId = getQuery("webAppId");
	timeOffset = getQuery("timeOffset");
	appPwd= getQuery("appPwd");
	var action = getQuery('action');
	var actionId = getQuery('actionId');
	var actionName = getQuery('actionName');
	if(actionName){
		actionName = decodeURIComponent(actionName);
	}
	
//	userID = '000000004b0b102f014b1084ef2c0002';
//	webAppId = 207;
//	timeOffset = '1453384476274';
//	appPwd = '4191AA0AA074F5B3DE3E83F4C29096E1';
	setCookie("userID",userID);
	setCookie("webAppId",webAppId);
	setCookie("timeOffset",timeOffset);
	setCookie("appPwd",appPwd);
	
	if(action==0){
		initByActionVideo();
	}else if(action==1){
		initByActionAudio();
	}else{
		initVideoBookList();
	}
	
	$('.navVideo').click(function(){
		if(!$('.navVideo').hasClass('navOn')){
			initVideoBookList();
		}
	});

	$('.navAudio').click(function(){
		if(!$('.navAudio').hasClass('navOn')){
			initAudioBookList();
		}
	});
	
	$('.navShare').click(function(){
		if(isWeiXin()){
			$('.shareContent img').attr('src', 'img/share_wechat.png');
		}else{
			$('.shareContent img').attr('src', 'img/share_normal.png');
		}
		$('.shareContent').show();
	});
	
	$('.shareContent').click(function(){
		$('.shareContent').hide();
	});
	
	$('#audioHeader').click(function(){
		var h = $(window).height();
		$('.audioMainContent').css('top', h+"px");
		$('.audioMainContent').css('bottom', -h+"px");
		$('.audioMainContent').show();
		$('.audioMainContent').animate({'top':0,'bottom':0}, 300);
	});
	$('.audioMainClose').click(function(){
		var h = $(window).height();
		$('.audioMainContent').animate({'top':h,'bottom':-h}, 300, 'linear', function(){
			$('.audioMainContent').hide();
		});
	})
	function initVideoBookList(){
		audio.pause();
		$('.navVideo').addClass('navOn');
		if($('.navAudio').hasClass('navOn')){
			$('.navAudio').removeClass('navOn');
		}
		$('#indexHeader').show();
		$('#videoHeader').hide();
		$('#videoMainHeader').hide();
		$('#audioHeader').hide();
		$('#indexHeader .headerTitle').text('视频资源');
		$('.indexContent').show();
		$('.videoContent').hide();
		$('.videoMainContent').hide();
		$('.audioContent').hide();
		$('.indexList').empty();
		request("ResourceService","getResourceBooks",{},
			       function(data){
			 		bookList = data.data;
					if(bookList != null && bookList.length >0){
						setBookList(0);
					}
			       },
			       function(msg){
					  alert(msg);
				   }
			    );
	}
	
	function initAudioBookList(){
		audio.pause();
		$('.navAudio').addClass('navOn');
		if($('.navVideo').hasClass('navOn')){
			$('.navVideo').removeClass('navOn');
		}
		$('#indexHeader').show();
		$('#videoHeader').hide();
		$('#videoMainHeader').hide();
		$('#audioHeader').hide();
		$('#indexHeader .headerTitle').text('音频资源');
		$('.indexContent').show();
		$('.videoContent').hide();
		$('.videoMainContent').hide();
		$('.audioContent').hide();
		$('.indexList').empty();
		request("ResourceService","getResourceBooks",{},
			       function(data){
			 		bookList = data.data;
					if(bookList != null && bookList.length >0){
						setBookList(1);
					}
			       },
			       function(msg){
					  alert(msg);
				   }
			    );
	}
	
	function setBookList(type){
		bookList.sort(function(a,b){
			return a.name>b.name?1:-1;
		});
		$(".indexContent").empty();
		var needColumn=true;
		var curColumn="";
		var list;
		//$('.catTitle').text('Pop Ready');
		//$('.indexList').empty();
		bookList.forEach(function(book){
			if(curColumn!=book.name.substr(0,10))
			{
				curColumn=book.name.substr(0,10);
				$(".indexContent").append('<div class="catTitle">'+curColumn+'</div>');
				$(".indexContent").append('<div class="indexLine"></div>');
				list=$('<div class="indexList"></div>');
				list.appendTo($(".indexContent"));				
			}
			if(book.type!=type) return;
			var item = $("<div id='"+book.id+"' class='bookItem'><img class='bookCover' src='"+
				server+book.img+"'/><div class='bookTitle'>"+
				book.name+"</div></div>");
			list.append(item);
			item.click(function(){
				if($('.navVideo').hasClass('navOn')){
					curBookId = $(this).attr('id');
					initVideo();
				}else if($('.navAudio').hasClass('navOn')){
					curBookId = $(this).attr('id');
					initAudio();
				}
			});
		});
		layoutAppIcon();
	}
	
	function layoutAppIcon(){
		var allW = $(window).width()-24;
		var li = $(".bookItem");
		var liW = 80;
		var count = Math.floor((allW/liW));
		li.width(allW/count);
	}
	
	function initAudio(){
		$('#indexHeader').hide();
		$('#videoHeader').hide();
		$('#videoMainHeader').hide();
		$('#audioHeader').show();
		$('.indexContent').hide();
		$('.videoContent').hide();
		$('.videoMainContent').hide();
		$('.audioContent').show();
		$('.audioContent').empty();
		//请求数据
		   request("ResourceService","getAudios",{bookid:curBookId},
		       function(data){
		       	 audioArr = data.data;
		       	 audioArr.forEach(function(dataItem){
					var item = $("<div class='audioItem'><div class='audioItemIcon'></div>\
						<div class='audioItemTitle'>"+
						dataItem.name+"</div></div>");
					$('.audioContent').append(item);
					item.click(function(evt){
						if(!item.hasClass('audioItemOn')){
							playAudio(audioArr.indexOf(dataItem));
						}
					});
				});
				if(audioArr.length>0){
					playAudio(0);
				}
		       },
		       function(msg){
				  alert(msg);
			   }
		    );
	}
	
	function playAudio(idx){
		if($(".audioPlayPause").hasClass('audioPause')){
			$(".audioPlayPause").removeClass('audioPause');
		}
		$(".audioPlayPause").addClass('audioPlay');
		if($(".audioMainPlayPause").hasClass('audioStatePause')){
			$(".audioMainPlayPause").removeClass('audioStatePause');
		}
		$(".audioMainPlayPause").addClass('audioStatePlay');
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
		$('.audioTitle').text(data.name);
		$('.audioMainTitle').text(data.name);
		audio.src = server+data.path;
		audio.load();
	}
	
	$('.audioPlayPause').click(function(evt){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
		evt.stopPropagation();
	});
	$('.audioMainPlayPause').click(function(evt){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	});
	
	audio.onplay = function(evt){
		if($(".audioPlayPause").hasClass('audioPlay')){
			$(".audioPlayPause").removeClass('audioPlay');
		}
		$(".audioPlayPause").addClass('audioPause');
		if($(".audioMainPlayPause").hasClass('audioStatePlay')){
			$(".audioMainPlayPause").removeClass('audioStatePlay');
		}
		$(".audioMainPlayPause").addClass('audioStatePause');
	}
		
	audio.onpause = function(evt){
		if($(".audioPlayPause").hasClass('audioPause')){
			$(".audioPlayPause").removeClass('audioPause');
		}
		$(".audioPlayPause").addClass('audioPlay');
		if($(".audioMainPlayPause").hasClass('audioStatePause')){
			$(".audioMainPlayPause").removeClass('audioStatePause');
		}
		$(".audioMainPlayPause").addClass('audioStatePlay');
	}
	
	audio.ontimeupdate = function(evt){
		var v = audio;
		var w = $('.audioTimeLine').width();
		var ww = v.currentTime/v.duration*w;
		$('.audioTimeTrack').css('width', ww+"px");
		
		var mw = $(window).width();
		var mww = v.currentTime/v.duration*mw;
		$('.audioMainPlayed').css('width', mww+'px');
		$('.audioMainThumb').css('left', (mww-5)+'px');
		
		$(".audioMainTimeTotal").text(formatTime(evt.currentTarget.duration));
		$(".audioMainTimePlayed").text(formatTime(evt.currentTarget.currentTime));
	}
		
	audio.onended = function(evt){
		audio.currentTime = 0;
		audio.pause();
		if($(".audioPlayPause").hasClass('audioPause')){
			$(".audioPlayPause").removeClass('audioPause');
		}
		$(".audioPlayPause").addClass('audioPlay');
		if($(".audioMainPlayPause").hasClass('audioStatePause')){
			$(".audioMainPlayPause").removeClass('audioStatePause');
		}
		$(".audioMainPlayPause").addClass('audioStatePlay');
			
		var cur = getPlayedIndex();
		if(cur<$('.audioItem').length-1){
			playAudio(cur+1);
		}
	}
	
	var oldTimeX;
	$('.audioMainThumb')[0].addEventListener('touchstart',function(evt){
		oldTimeX = evt.clientX;
		document.addEventListener('touchmove', mousemovetime);
		document.addEventListener('touchend', mouseuptime);
	});
	function mousemovetime(evt){
		var x = evt.clientX;
		var thumbX = parseInt($('.audioMainThumb').css('left'));
		var newX = thumbX + (x-oldTimeX);
		oldTimeX = x;
		var minX = parseInt($('.audioMainTrack').css('left'))-5;
		var maxX = parseInt($('.audioMainTrack').css('left'))+$('.audioMainTrack').width()-5;
		if(newX<minX){
			newX = minX;
		}
		if(newX>maxX){
			newX = maxX;
		}
		$('.audioMainThumb').css('left', newX+'px');
		var v = (newX-minX)/(maxX-minX);
		var w = $('.audioMainTrack').width();
		var ww = v*w;
		$('.audioMainPlayed').css('width', ww+"px");
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
	
	function getPlayedIndex(){
		var list = $('.audioItem');
		for(var i=0; i<list.length; i++){
			if($(list[i]).hasClass('audioItemOn')){
				return i;
			}
		}
		return -1;
	}
	
	$('.audioNext').click(function(){
		var cur = getPlayedIndex();
		if(cur<$('.audioItem').length-1){
			playAudio(cur+1);
		}
	});
	
	$('.audioMainNext').click(function(){
		var cur = getPlayedIndex();
		if(cur<$('.audioItem').length-1){
			playAudio(cur+1);
		}
	});
	$('.audioMainPrev').click(function(){
		var cur = getPlayedIndex();
		if(cur>0){
			playAudio(cur-1);
		}
	});
	
	$('#audioHeader .left').click(function(evt){
		audio.pause();
		initAudioBookList();
		evt.stopPropagation();
	});
	
	function initVideo(){
		$('#indexHeader').hide();
		$('#videoHeader').show();
		$('#videoMainHeader').hide();
		$('#audioHeader').hide();
		$('.indexContent').hide();
		$('.videoContent').show();
		$('.videoMainContent').hide();
		$('.audioContent').hide();
		//请求数据
		   request("ResourceService","getUnits",{bookid:curBookId},
		       function(data){
			   	curVideoUnits = data.data;
				if(curVideoUnits != null && curVideoUnits.length >0){
					initUnitVideo(0);
				}
		       },
		       function(msg){
				  alert(msg);
			   }
		    );
	}
	
	function backVideoInit(){
		$('#indexHeader').hide();
		$('#videoHeader').show();
		$('#videoMainHeader').hide();
		$('#audioHeader').hide();
		$('.indexContent').hide();
		$('.videoContent').show();
		$('.videoMainContent').hide();
		$('.audioContent').hide();
		initUnitVideo(curVideoUnitIndex);
	}
	
	function initUnitVideo(uIndex){
		curVideoUnitIndex = uIndex;
		$('.videoUnitTitle').text(curVideoUnits[uIndex].name);
		var unitName = curVideoUnits[uIndex].name;
		$('.videoContent').empty();
		 request("ResourceService","getVideos",{bookid:curBookId,unitName:unitName},
			       function(data){
			       	var dataArr = data.data;
					if(dataArr != null && dataArr.length >0){
						dataArr.forEach(function(dataItem){
							var item = $("<div class='videoItem'><img class='videoItemIcon' src='"+
								getVideoIcon(dataItem.type)+"' />\
								<div class='videoItemTitle'>"+
								dataItem.name+"</div></div>");
							$('.videoContent').append(item);
							item.click(function(evt){
								videoMainData = dataItem;
								initVideoMain();
							});
						});
					}
			       },
			       function(msg){
					  alert(msg);
				   }
			    );
	}
	
	$('#videoHeader .left').click(function(){
		if(curVideoUnitIndex>0 && curVideoUnits && curVideoUnits.length>0){
			initUnitVideo(curVideoUnitIndex-1);
		}else{
			initVideoBookList();
		}
	});
	
	$('#videoHeader .right').click(function(){
		if(curVideoUnitIndex < curVideoUnits.length-1){
			initUnitVideo(curVideoUnitIndex+1);
		}
	})
	
	function getVideoIcon(type){
		if(type=='歌谣'){
			return 'img/geyao.png';
		}else if(type=="对话"){
			return 'img/duihua.png';
		}else if(type=='故事'){
			return 'img/gushi.png';
		}else if(type=='单词'){
			return 'img/danci.png';
		}else if(type=='语音'){
			return 'img/yuyin.png';
		}
		return "";
	}
	
	function initVideoMain(){
		console.log(JSON.stringify(videoMainData))
		$('#indexHeader').hide();
		$('#videoHeader').hide();
		$('#videoMainHeader').show();
		$('#audioHeader').hide();
		$('.indexContent').hide();
		$('.videoContent').hide();
		$('.videoMainContent').show();
		$('.audioContent').hide();
		$('.videoMainTitle').text(videoMainData.name)
		playVideo();
//		$('.videoMain').empty();
//		var mp4 = document.createElement('source'); 
// 		mp4.src = videoMainData.url; 
//  		mp4.type= 'video/mp4;';
//  		mp4.codecs='avc1.42E01E, mp4a.40.2';
//  		$('.videoMain').append(mp4); 
	}
	
	$('#videoMainHeader .left').click(function(){
		$('video')[0].pause();
		backVideoInit();
	})
	
	/**播放视频播放*/
	function playVideo(){
		ccid = videoMainData.ccid;
		if(ccid != 0){
			$("#jiema").hide();
			
			$(".playDiv div").remove();
			$(".playDiv script").remove();
		
			var dom = document.getElementById("playDiv");
			var sc = document.createElement("script");
			sc.setAttribute("type","text/javascript");
			sc.setAttribute("id","scriptId");
			dom.appendChild(sc);
		
			var url="http://union.bokecc.com/player?vid="+ccid+"&siteid=8B90641B41283EDC&autoStart=true&width=100%&height=auto&playerid=406D2DF0A2BD3485&playertype=1";
			$("#scriptId").attr("src",url);
			cc_js_Player.showPlayer();
		}else{
			$("#jiema").show();
		}
		
	}
	
	function initByActionVideo(){
		videoMainData = {name:actionName,ccid:actionId};
		initVideoMain();
	}
	
	function initByActionAudio(){
		curBookId = actionId;
		initAudio();
	}
});


