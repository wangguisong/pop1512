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

$(document).ready(function(){
	userID = getQuery("userID");
	webAppId = getQuery("webAppId");
	timeOffset = getQuery("timeOffset");
	
	initVideoBookList();
	
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
		
		$.ajax("asset/video-book.data").success(function(data){
			bookList = eval("("+data+")");
			setBookList();
		});
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
		
		$.ajax("asset/audio-book.data").success(function(data){
			bookList = eval("("+data+")");
			setBookList();
		});
	}
	
	function setBookList(){
		$('.catTitle').text('Pop Ready');
		$('.indexList').empty();
		bookList.forEach(function(book){
			var item = $("<div class='bookItem'><img class='bookCover' src='"+
				book.icon+"'/><div class='bookTitle'>"+
				book.title+"</div></div>");
			$('.indexList').append(item);
			item.click(function(){
				if($('.navVideo').hasClass('navOn')){
					initVideo(bookList.indexOf(book));
				}else if($('.navAudio').hasClass('navOn')){
					initAudio(bookList.indexOf(book));
				}
			});
		});
		layoutAppIcon();
	}
	
	function layoutAppIcon(){
		var allW = $(window).width();
		var li = $(".bookItem");
		var liW = li.width();
		var count = Math.floor((allW/liW));
	    var left = (allW - (liW*count))/2;
		li.css("margin-left",left);
	}
	
	function initAudio(bookIndex){
		$('#indexHeader').hide();
		$('#videoHeader').hide();
		$('#videoMainHeader').hide();
		$('#audioHeader').show();
		$('.indexContent').hide();
		$('.videoContent').hide();
		$('.videoMainContent').hide();
		$('.audioContent').show();
		$('.audioContent').empty();
		$.ajax("asset/audio.data").success(function(data){
			audioArr = eval("("+data+")");
			audioArr.forEach(function(dataItem){
				var item = $("<div class='audioItem'><div class='audioItemIcon'></div>\
					<div class='audioItemTitle'>"+
					dataItem.title+"</div></div>");
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
		});
	}
	
	function playAudio(idx){
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
		$('.audioTitle').text(data.title);
		audio.src = data.url;
		audio.load();
	}
	
	$('.audioPlayPause').click(function(evt){
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
	}
		
	audio.onpause = function(evt){
		if($(".audioPlayPause").hasClass('audioPause')){
			$(".audioPlayPause").removeClass('audioPause');
		}
		$(".audioPlayPause").addClass('audioPlay');
	}
	
	audio.ontimeupdate = function(evt){
		var v = audio;
		var w = $('.audioTimeLine').width();
		var ww = v.currentTime/v.duration*w;
		$('.audioTimeTrack').css('width', ww+"px");
	}
		
	audio.onended = function(evt){
		audio.currentTime = 0;
		audio.pause();
		if($(".audioPlayPause").hasClass('audioPause')){
			$(".audioPlayPause").removeClass('audioPause');
		}
		$(".audioPlayPause").addClass('audioPlay');
			
		var cur = getPlayedIndex();
		if(cur<$('.audioItem').length-1){
			playAudio(cur+1);
		}
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
	
	$('#audioHeader .left').click(function(){
		audio.pause();
		initAudioBookList();
	});
	
	function initVideo(bookIndex){
		$('#indexHeader').hide();
		$('#videoHeader').show();
		$('#videoMainHeader').hide();
		$('#audioHeader').hide();
		$('.indexContent').hide();
		$('.videoContent').show();
		$('.videoMainContent').hide();
		$('.audioContent').hide();
		initUnitVideo(0);
	}
	
	function initUnitVideo(uIndex){
		$('.videoUnitTitle').text('Unit 1');
		$('.videoContent').empty();
		$.ajax("asset/video.data").success(function(data){
			audioArr = eval("("+data+")");
			audioArr.forEach(function(dataItem){
				var item = $("<div class='videoItem'><img class='videoItemIcon' src='"+
					getVideoIcon(dataItem.type)+"' />\
					<div class='videoItemTitle'>"+
					dataItem.title+"</div></div>");
				$('.videoContent').append(item);
				item.click(function(evt){
					videoMainData = dataItem;
					initVideoMain();
				});
			});
		});
	}
	
	$('#videoHeader .left').click(function(){
		initVideoBookList();
	});
	
	$('#videoHeader .right').click(function(){
		initUnitVideo(0);
	})
	
	function getVideoIcon(type){
		if(type==1){
			return 'img/geyao.png';
		}else if(type==2){
			return 'img/duihua.png';
		}else if(type==3){
			return 'img/gushi.png';
		}else if(type==4){
			return 'img/danci.png';
		}else if(type==5){
			return 'img/yuyin.png';
		}
		return "";
	}
	
	function initVideoMain(){
		$('#indexHeader').hide();
		$('#videoHeader').hide();
		$('#videoMainHeader').show();
		$('#audioHeader').hide();
		$('.indexContent').hide();
		$('.videoContent').hide();
		$('.videoMainContent').show();
		$('.audioContent').hide();
		$('.videoMainTitle').text(videoMainData.title)
		$('.videoMain').prop('src', videoMainData.url);
	}
	
	$('#videoMainHeader .left').click(function(){
		$('.videoMain')[0].pause();
		initVideo(0);
	})
});


