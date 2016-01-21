
/*
CC Video Player
v1.0.0
*/

// Self-executing function to prevent global vars and help with minification
(function (window, undefined) {
	var document = window.document;
	
	// Singleton, to prevent multiple initialization
	if(window.cc_js_Player){
		window.cc_js_Player.showPlayer();
		return;
	}
	
	// player
	function Player(){
	};
	
	// Use prototype to init function
	Player.prototype = {
		videoInfo: new Array(),
		isIE: function () {
			return navigator.userAgent.match(/MSIE/i) != null;
		},
		isIPad: function () {
			return navigator.userAgent.match(/iPad/i) != null;
		},
		isIPhone: function () {
			return navigator.userAgent.match(/iPhone/i) != null;
		},
		isAndroid: function () {
			return navigator.userAgent.match(/Android/i) != null;
		},
		isAndroid2: function () {
			return navigator.userAgent.match(/Android 2/i) != null;
		},
		isSymbianOS: function () {
			return navigator.userAgent.match(/SymbianOS/i) != null;
		},
		isWindowsPhoneOS: function () {
			return navigator.userAgent.match(/Windows Phone/i) != null;
		},
		showPlayer: function () {
			var scripts = document.getElementsByTagName("script");
			for(var i = 0;i < scripts.length;i=i+1){
				var script = scripts[i];
				if(script.src.indexOf("http://union.bokecc.com/player") == -1 && script.src.indexOf("http://p.bokecc.com/player") == -1){
					continue;
				}
				var src = script.src;
				script.src="";//
				var params = this.getParam(src.split("?")[1]);
				var video = document.createElement("div");
				var randomid = Math.ceil(Math.random() * 10000000);
				video.id = "cc_video_" + params.vid + "_" + randomid;
				params.divid = video.id;
				video.style.width = params.width;
				video.style.height = params.height;
				if(this.isMoble()){
					video.style.position = "relative";
				}
				video.innerHTML = "";
				// save video params
				this.videoInfo.push(params);
				script.parentNode.replaceChild(video, script);
				
				if(this.isAndroid() && !this.isAndroid2()){
					this.jsonp("http://p.bokecc.com/servlet/getvideofile?vid="
							+ params.vid + "&siteid=" + params.siteid + "&divid="
							+ params.divid + "&width=" + encodeURIComponent(window.screen.width, "UTF-8") + "&useragent="
							+ params.userAgent + "&version=20140214" + "&hlssupport=1","cc_js_Player.showPlayerView");
				} else if(this.isIPhone() || this.isIPad()){
					this.jsonp("http://p.bokecc.com/servlet/getvideofile?vid="
							+ params.vid + "&siteid=" + params.siteid + "&divid="
							+ params.divid + "&width=" + encodeURIComponent(params.width, "UTF-8") + "&useragent="
							+ params.userAgent + "&version=20140214" + "&hlssupport=1","cc_js_Player.showPlayerView");
				} else{
					this.jsonp("http://p.bokecc.com/servlet/getvideofile?vid="
							+ params.vid + "&siteid=" + params.siteid + "&divid="
							+ params.divid + "&width=" + encodeURIComponent(params.width, "UTF-8") + "&useragent="
							+ params.userAgent + "&version=20140214" + "&hlssupport=0","cc_js_Player.showPlayerView");
				}
			}
		},
		getParam: function(queryString){
			var params = queryString.split("&");
			var result = {};
			for(var i = 0;i < params.length;i=i+1){
				var key_value = params[i].split("=");
				var key = (key_value[0] + "").replace(/(^\s*)|(\s*$)/g, "");// trim
				result[key] = key_value[1];
			}
			params.height = params.width / 4 * 3;
			result.userAgent = this.getUserAgent();
			return result;
		},
		getUserAgent: function(){
			var userAgent = navigator.userAgent.match(/MSIE|Firefox|iPad|iPhone|Android|SymbianOS/);
			
			var winPhoneUA = navigator.userAgent.match(/Windows Phone/);
			if (winPhoneUA == "Windows Phone"){
				userAgent = winPhoneUA;
			}
			
			if(userAgent){
				return userAgent;
			} else {
				return "other";
			}
		},
		isMoble: function(){
			var userAgent = navigator.userAgent.match(/iPhone|Android|SymbianOS|Windows Phone/);
			if(userAgent){
				return true;
			} else {
				return false;
			}
		},
		getVideoCode: function (params, video) {
			var videoCode = "";
			
			//if (video.uid == "127495"){
				// caixin player
			//	videoCode = this.createCaiXinView(params);
			//} else {
				// noraml player
				if (this.isSymbianOS()) {
					videoCode = this.createMobileView(params, video);
				} else if (this.isIPhone()){

					// shengjing autoplay
					if(video.uid == "225153"){
						videoCode = this.createAutoplayView(params, video);
					} else {
						videoCode = this.createIphoneView(params, video);
					}
					
				} else if (this.isAndroid() || video.playtype == 1 || this.isIPad() || this.isWindowsPhoneOS()) {
					videoCode = this.createHTML5VideoView(params, video);
				} else {
					videoCode = this.createFlashView(params);
				}
			//}
			
			return videoCode;
		},
		getDefaultCopy: function (video) {
			for (var c in video.copies) {
				if (video.defaultquality == video.copies[c].quality) {
					return video.copies[c];
				}
			}
			return video.copies[0];
			
		},
		createMobileView: function(params, video){
				var twidth = params.width;
				var theight = params.height;
				if(!isNaN(params.width) || !isNaN(params.height)){
				   twidth = params.width + 'px';
				   theight = params.height + 'px';
				}
				if(video.status == 1){
					// var buttonwidth = 70;
					// var buttonheight = 50;
					// var top = (params.height - buttonheight) / 2;
					// var left = (params.width - buttonwidth) / 2;
					return "<table width='"+params.width+"' height='"+params.height+"' style='position:relative;'><tr><td width='"+params.width+"' height='"+params.height+"' style='position:relative;'><img src='" 
					+ video.img + "' width='"+params.width+"' height='"+params.height+"' style='width:" + twidth + "; height:" + theight + ";' />"
					+ "<a href='" +  this.getDefaultCopy(video).playurl
					+ "'><img src='http://p.bokecc.com/images/01.png' style='position:absolute; top:50%; left:50%; margin:-25px 0 0 -35px; width:70px; height:50px;' /></a></td></tr></table>";
				}else if(video.status == 0) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，视频已删除，请联系网站管理员。</td></tr></table>";
				} else if(video.status == 2) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>视频处理中……请稍候观看。</td></tr></table>";
				} else if(video.status == 4) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，网络连接失败，请刷新重试或联系网站管理员。</td></tr></table>";
				} else {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，暂不支持本设备，请选择其他设备观看。</td></tr></table>";
				}
		},
		createIphoneView: function(params, video){
			if(video.status == 1){
					return "<video id='cc_"+ params.vid +"' preload='none' controls x-webkit-airplay='allow' poster='" + video.img + "' width='" + params.width + "' height='" + params.height + "' src='" + this.getDefaultCopy(video).playurl + "'></video>";
				}else if(video.status == 0) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，视频已删除，请联系网站管理员。</td></tr></table>";
				} else if(video.status == 2) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>视频处理中……请稍候观看。</td></tr></table>";
				} else if(video.status == 4) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，网络连接失败，请刷新重试或联系网站管理员。</td></tr></table>";
				} else {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，暂不支持本设备，请选择其他设备观看。</td></tr></table>";
				}
		},
		createAutoplayView: function(params, video){
			if(video.status == 1){
					return "<video id='cc_"+ params.vid +"' preload='none' controls x-webkit-airplay='allow' poster='" + video.img + "' width='" + params.width + "' height='" + params.height + "' src='" + this.getDefaultCopy(video).playurl + "' autoplay='autoplay' webkit-playsinline ></video>";
				}else if(video.status == 0) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，视频已删除，请联系网站管理员。</td></tr></table>";
				} else if(video.status == 2) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>视频处理中……请稍候观看。</td></tr></table>";
				} else if(video.status == 4) {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，网络连接失败，请刷新重试或联系网站管理员。</td></tr></table>";
				} else {
					return  "<table><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，暂不支持本设备，请选择其他设备观看。</td></tr></table>";
				}
		},
		createHTML5VideoView: function(params, video){
			var twidth = params.width;
			var theight = params.height;
			if(!isNaN(params.width) || !isNaN(params.height)){
			   twidth = params.width + 'px';
			   theight = params.height + 'px';
			}
			if(video.status == 1){
				return "<div class='ccH5playerBox'>"
						+"	<div class='ccH5Info'></div>"
						+"	<div class='ccH5Loading'></div>"
						+"	<div class='ccH5Poster'><img src='" + video.img + "' width='100%' height='100%' /></div>"
						+"	<video id='cc_"+ params.vid +"' x-webkit-airplay='allow' width='" + params.width + "' height='" + params.height + "' src='" + this.getDefaultCopy(video).playurl + "'>您的浏览器不支持html5 video</video>"
						+"	<div class='ccH5PlayBtn'></div>"
						+"	<section class='ccH5FadeIn'>"
						+"		<div class='ccH5ProgressBar'>"
						+"			<div class='ccH5LoadBar'>"
						+"				<div class='ccH5CurrentPro'>"
						+"					<span class='ccH5DragBtn'></span>"
						+"				</div>"
						+"			</div>"
						+"		</div>"
						+"		<span class='ccH5TogglePlay'></span>"
						+"		<div class='ccH5Time'>"
						+"			<em class='ccH5TimeCurrent'>00:00</em><span>/</span><em class='ccH5TimeTotal'>00:00</em>"
						+"		</div>"
						+"		<a href='javascript:;' class='ccH5vm'>T</a>"
						+"		<div class='ccH5vmdiv'>"
						+"			<div class='ccH5vmbar'>"
						+"				<div class='ccH5vmbarPro'>"
						+"					<span class='ccH5DragVmBtn'></span>"
						+"				</div>"
						+"			</div>"
						+"		</div>"
						+"		<a href='javascript:;' class='ccH5sp'>" + decodeURIComponent('%E5%B8%B8%E9%80%9F') + "</a>"
						+"		<ul class='ccH5spul'>"
						+"			<li>2" + decodeURIComponent('%E5%80%8D') + "</li>"
						+"			<li>1.5" + decodeURIComponent('%E5%80%8D') + "</li>"
						+"			<li class='selected'>" + decodeURIComponent('%E5%B8%B8%E9%80%9F') + "</li>"
						+"			<li>0.8" + decodeURIComponent('%E5%80%8D') + "</li>"
						+"		</ul>"
						+"		<a href='javascript:;' class='ccH5hd'>" + this.getDefaultCopy(video).desp + "</a>"
						+"		<ul class='ccH5hdul'>"
						+"		</ul>"
						+"		<em class='ccH5FullsBtn'>B</em>"
						+"	</section>"
						+"</div>";
			}else if(video.status == 0) {
				return  "<table style='border:none; padding:0; margin:0; width:" + twidth + "; height:" + theight + ";'><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; border:none; padding:0; margin:0; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，视频已删除，请联系网站管理员。</td></tr></table>";
			} else if(video.status == 2) {
				return  "<table style='border:none; padding:0; margin:0; width:" + twidth + "; height:" + theight + ";'><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; border:none; padding:0; margin:0; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>视频处理中……请稍候观看。</td></tr></table>";
			} else if(video.status == 4) {
				return  "<table style='border:none; padding:0; margin:0; width:" + twidth + "; height:" + theight + ";'><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; border:none; padding:0; margin:0; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，网络连接失败，请刷新重试或联系网站管理员。</td></tr></table>";
			} else {
				return  "<table style='border:none; padding:0; margin:0; width:" + twidth + "; height:" + theight + ";'><tr><td align='center' width='" + params.width + "' height='"
						+ params.height + "' style='background:#000; border:none; padding:0; margin:0; color:#FFF; font-size:30px; -webkit-text-size-adjust:none;'>抱歉，暂不支持本设备，请选择其他设备观看。</td></tr></table>";
			}
		},
		createFlashView: function(params){
			return "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "
						+ "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash." 
						+ "cab#version=7,0,0,0' width='" + params.width + "' height='" + params.height 
						+ "' id='cc_" + params.vid + "'>"
						+ "<param name='movie' value='http://p.bokecc.com/flash/player.swf?vid="
						+ params.vid + "&siteid=" + params.siteid + "&playerid=" + params.playerid
						+ "&playertype=" + params.playertype + "&autoStart=" + params.autoStart + "' />"
						+ "<param value='transparent' name='wmode' />"
						+ "<param name='allowFullScreen' value='true' />"
						+ "<param name='allowScriptAccess' value='always' />"
						+ "<embed src='http://p.bokecc.com/flash/player.swf?vid="
						+ params.vid + "&siteid=" + params.siteid + "&playerid=" + params.playerid
						+ "&playertype=" + params.playertype
						+ "&autoStart=" + params.autoStart + "' width='" + params.width + "' height='" + params.height 
						+ "' name='cc_" + params.vid + "' wmode='transparent' allowFullScreen='true' allowScriptAccess='always'"
						+ " pluginspage='http://www.macromedia.com/go/getflashplayer' "
						+ "type='application/x-shockwave-flash'/></object>";
		},
		createCaiXinView: function(params){
			// caixin player
			return "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "
						+ "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash." 
						+ "cab#version=7,0,0,0' width='" + params.width + "' height='" + params.height 
						+ "' id='cc_" + params.vid + "'>"
						+ "<param name='movie' value='http://cc.caixin.cn/flash/player.swf?vid="
						+ params.vid + "' />"
						+ "<param value='transparent' name='wmode' />"
						+ "<param name='allowFullScreen' value='true' />"
						+ "<param name='allowScriptAccess' value='always' />"
						+ "<embed src='http://cc.caixin.cn/flash/player.swf?vid="
						+ params.vid + "' width='" + params.width + "' height='" + params.height 
						+ "' name='cc_" + params.vid + "' wmode='transparent' allowFullScreen='true' allowScriptAccess='always'"
						+ " pluginspage='http://www.macromedia.com/go/getflashplayer' "
						+ "type='application/x-shockwave-flash'/></object>";
		},
		jsonp: function(url, callback){
			// use setTimeout to handle multiple requests problem, force them in
			// a queue
			setTimeout(function(){
				var head = document.getElementsByTagName("head")[0] || document.documentElement;
				var script = document.createElement("script");
				// add the param callback to url, and avoid cache
				script.src = url + "&callback=" + callback + "&r=" + Math.random() * 10000000;			
				// Use insertBefore instead of appendChild to circumvent an IE6
				// bug.
				// This arises when a base node is used.
				head.insertBefore( script, head.firstChild );
				script.onload = script.onreadystatechange = function(){
					// use /loaded|complete/.test( script.readyState ) to test
					// IE6 ready,!this.readyState to test FF
					if (!this.readyState || /loaded|complete/.test( script.readyState )) {
						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};				
			},0);
		},
		html5PlayerSkin: function(params, video, ts){
			(function(){
				// player skin
				var css=document.createElement('link');  
				css.href='http://p.bokecc.com/css/html5player/skin_pc.css?v1.0';  
				if(ts.isIPad() || ts.isWindowsPhoneOS()){
					css.href='http://p.bokecc.com/css/html5player/skin2.css?v5.91';
					if(navigator.userAgent.match('8')){
						css.href='http://p.bokecc.com/css/html5player/skin2_8.0.css?v5.91';
					}
				}
				if (video.uid == "224662") {
					css.href='http://p.bokecc.com/css/html5player/skin_Android.css?v5.92';
				}
				if(ts.isAndroid()){
					css.href='http://p.bokecc.com/css/html5player/skin_Android.css?v5.92';
				}
				css.rel="stylesheet";  
				css.type="text/css";  
				document.head.appendChild(css);
				
				// play statistic
				/*var vm = document.createElement("script");
				vm.src = "http://p.bokecc.com/js/statistic/monitor.js";
				document.head.appendChild(vm);
				vm.onload = function(){
					var videoMonitor = new VideoMonitor({
						uid:params.siteid,
						vid:params.vid,
						video:'cc_' + params.vid
					});
					videoMonitor.start();
				};*/
			})();
			function CCHtml5Player(){};
			HTMLElement.prototype.show = function() {
				this.style.display = "block";
			};
			HTMLElement.prototype.hide = function() {
				this.style.display = "none";
			};
			CCHtml5Player.prototype = {
				addListener: function(element, type, handler){
					element.addEventListener(type, handler, false);
				},
				init: function(id){
					this.oDiv = document.getElementById(id);
					this.oVideo = this.oDiv.getElementsByTagName("video")[0];
					this.playBtn = this.oDiv.getElementsByClassName("ccH5PlayBtn")[0];
					this.videoBox = this.oDiv.getElementsByClassName("ccH5playerBox")[0];
					this.oLoading = this.oDiv.getElementsByClassName("ccH5Loading")[0];
					this.oInfo = this.oDiv.getElementsByClassName("ccH5Info")[0];
					this.poster = this.oDiv.getElementsByClassName("ccH5Poster")[0]; 
					this.ctrlBar = this.oDiv.getElementsByTagName("section")[0];
					this.loadBar = this.oDiv.getElementsByClassName("ccH5LoadBar")[0];
					this.toggleBtn = this.oDiv.getElementsByClassName("ccH5TogglePlay")[0];
					this.progressBar = this.oDiv.getElementsByClassName("ccH5ProgressBar")[0];
					this.dragBtn = this.oDiv.getElementsByClassName("ccH5DragBtn")[0];
					this.timeCurrent = this.oDiv.getElementsByClassName("ccH5TimeCurrent")[0];
					this.timeTotal = this.oDiv.getElementsByClassName("ccH5TimeTotal")[0];
					this.proCurrent = this.oDiv.getElementsByClassName("ccH5CurrentPro")[0];
					this.fullsBtn = this.oDiv.getElementsByClassName("ccH5FullsBtn")[0];
					this.hdBtn = this.oDiv.getElementsByClassName("ccH5hd")[0];
					this.hdUL = this.oDiv.getElementsByClassName("ccH5hdul")[0];
					this.spBtn = this.oDiv.getElementsByClassName("ccH5sp")[0];
					this.spUL = this.oDiv.getElementsByClassName("ccH5spul")[0];
					this.spLi = this.spUL.getElementsByTagName("li");
					this.vmBtn = this.oDiv.getElementsByClassName("ccH5vm")[0];
					this.vmDiv = this.oDiv.getElementsByClassName("ccH5vmdiv")[0];
					this.vmDragBtn = this.oDiv.getElementsByClassName("ccH5DragVmBtn")[0];
					this.vmBar = this.oDiv.getElementsByClassName("ccH5vmbar")[0];
					this.vmPro = this.oDiv.getElementsByClassName("ccH5vmbarPro")[0];
					
					(function(i){ 
						if(!isNaN(params.width) || !isNaN(params.height)){
						   i.videoBox.style.width = params.width + 'px';
						   i.videoBox.style.height = params.height + 'px';
						}
						else{
							i.videoBox.style.width = params.width;
							i.videoBox.style.height = params.height;
						}
					})(this);
					if(ts.isAndroid()){
						this.ctrlWidth = this.videoBox.clientWidth - 218;
					} else if (ts.isIPad() && navigator.userAgent.match('8')){
						this.ctrlWidth = this.videoBox.clientWidth - 313;
					} else{
						this.ctrlWidth = this.videoBox.clientWidth - 378;
					}
					
					var _this = this;
					this.addListener(this.playBtn, 'click', function(){_this.play();});
					this.addListener(this.toggleBtn, 'click', function(){_this.togglePlay();});
					this.addListener(this.oVideo, 'timeupdate', function(){_this.timeupdate();});
					this.addListener(this.fullsBtn, 'click', function(){_this.fullScreen();});
					this.addListener(this.oVideo, 'play', function(){_this.play();});
					this.addListener(this.oVideo, 'pause', function(){_this.pause();});
					this.addListener(this.oVideo, 'playing', function(){_this.playing();});
					this.addListener(this.oVideo, 'progress', function(){_this.progress();});
					this.addListener(this.oVideo, 'ended', function(){_this.ended();});
					this.addListener(this.oVideo, 'seeking', function(){_this.seeking();});
					this.addListener(this.oVideo, 'seeked', function(){_this.seeked();});
					this.addListener(this.oVideo, 'waiting', function(){_this.waiting();});
					this.addListener(this.oVideo, 'canplay', function(){_this.canplay();});
					this.addListener(this.oVideo, 'gesturechange', function(e){
						if(e.scale > 1){
							_this.fullScreen();
						}
					});
					this.addListener(this.oVideo, 'touchstart', function(e){
						if(e.touches.length == 2){
							_this.ctrlBar.className = "ccH5FadeIn";
							_this.oVideo.ontouchend = function(){
								_this.togglePlay();
								_this.oVideo.ontouchend = null;
							};
						}
					});
					this.addListener(this.oVideo, 'touchend', function(e){
						if(e.changedTouches.length == 1){
							_this.toggleCtrlBar();
						}
					});
					
					// HD
					this.addListener(this.hdBtn, 'click', function(){_this.toggleHd();});
					
					
					// playbackRate
					this.addListener(this.spBtn, 'click', function(){_this.toggleSp();});
					for(i=0; i<4; i++){
						var _this = this;
						this.spLi[i].index = i;
						this.addListener(this.spLi[i], 'click', function(){
							var s = [2, 1.5, 1, 0.8];
							for(j=0; j<4; j++){
								_this.spLi[j].className = "";
							}
							this.className = "selected";
							
							if(ts.isIPad()){
								_this.oVideo.pause();
							}
							_this.oVideo.playbackRate = s[this.index];

							_this.spUL.hide();
							_this.spBtn.style.background = 'rgba(51,51,51,0.8)';	
							_this.spBtn.innerHTML = this.innerHTML;
							if(ts.isIPad()){
								setTimeout(function(){
									_this.oVideo.play();
								}, 300)
							}
						});
					};
					
					this.setQuality(video);
					
					// vm
					var timer = null;
					function vmShow(){
						_this.vmDiv.show();
						clearTimeout(timer);
					};
					function vmHide(){
						timer = setTimeout(function(){
							_this.vmDiv.hide();
						}, 300);
					};
					
					this.addListener(this.vmBtn, 'mouseover', vmShow);
					this.addListener(this.vmBtn, 'mouseout', vmHide);
					this.addListener(this.vmDiv, 'mouseover', vmShow);
					this.addListener(this.vmDiv, 'mouseout', vmHide);
					
					this.dragVm(this.vmDragBtn);
				},
				toggleHd: function(){
					if(this.hdUL.style.display == 'block'){
						this.hdUL.hide();
						this.hdBtn.style.background = 'rgba(51,51,51,0.8)';	
					}else{
						this.hdUL.show();
						this.hdBtn.style.background = 'rgba(249,116,9,0.8)';	
					}
					this.spUL.hide();
					this.spBtn.style.background = 'rgba(51,51,51,0.8)';	
				},
				toggleSp: function(){
					if(this.spUL.style.display == 'block'){
						this.spUL.hide();
						this.spBtn.style.background = 'rgba(51,51,51,0.8)';	
					}else{
						this.spUL.show();
						this.spBtn.style.background = 'rgba(249,116,9,0.8)';	
					}
					this.hdUL.hide();
					this.hdBtn.style.background = 'rgba(51,51,51,0.8)';	
				},
				setQuality: function(video){
					for(i=0; i < video.copies.length; i++){
						var li =document.createElement("li");
						var liText =document.createTextNode(video.copies[i].desp);
						li.appendChild(liText);
						this.hdUL.appendChild(li);
						this.hdUL.style.top = -video.copies.length * 30 + 'px';
					}
					this.switchQuality();
				},
				switchQuality: function(){
					var hdLi = this.hdUL.getElementsByTagName("li");
					for(i=0; i < hdLi.length; i++){
						var _this = this;
						hdLi[i].index = i;
						if(hdLi[i].innerHTML ==  this.hdBtn.innerHTML){
							hdLi[i].className = 'selected';
						}
						if(hdLi.length > 1){
							this.addListener(hdLi[i], 'click', function(){
								for(i=0; i < hdLi.length; i++){
									hdLi[i].className = "";
								}
								this.className = 'selected';
								_this.hdBtn.innerHTML = video.copies[this.index].desp;
								_this.hdUL.hide();
								_this.hdBtn.style.background = 'rgba(51,51,51,0.8)';	
								
								var t = _this.oVideo.currentTime;
								
								_this.oVideo.src = video.copies[this.index].playurl;
								
								_this.spBtn.innerHTML = _this.spLi[2].innerHTML;
								for(i=0; i<4; i++){
									_this.spLi[i].className = "";
								}
								_this.spLi[2].className = "selected";
								
								var h = function(){
									_this.oVideo.removeEventListener('canplay', h, false);
									
									_this.setDura(t);
									
									_this.pause();
									setTimeout(function(){
										_this.play();
									}, 300)
								}
								
								_this.addListener(_this.oVideo, 'canplay', h);
							});
						}
					}
				},
				play: function(){
					this.oVideo.play();
					this.playBtn.hide();
					this.poster.hide();
					this.toggleBtn.className = "ccH5TogglePause";
					this.toggleFade();
					this.drag(this.dragBtn);
					this.singleTouch(this.oVideo);
					var _this = this;
					this.progressBar.ontouchstart = this.progressBar.onclick = function(e){
						_this.posDuration(e);
					};
				},
				pause: function(){
					this.oVideo.pause();
					//this.playBtn.show();
					this.toggleBtn.className = "ccH5TogglePlay";
				},
				togglePlay: function(){
					if(this.oVideo.paused){
						this.play();
					} else {
						this.pause();
					}
				},
				playing: function(){
					this.playBtn.hide();
					this.poster.hide();
					this.toggleBtn.className = "ccH5TogglePause";
				},
				ended: function(){
					this.toggleBtn.className = "ccH5TogglePlay";
					this.playBtn.className = "adrPlayBtn";
					this.playBtn.show();
				},
				seeking: function(){
					this.oLoading.show();
				},
				seeked: function(){
					this.oLoading.hide();
				},
				waiting: function(){
					// this.oLoading.show();
				},
				canplay: function(){
					this.oLoading.hide();
				},
				ctrlFadeIn: function(){
					this.ctrlBar.className = "ccH5FadeIn";
				},
				ctrlFadeOut: function(){
					this.ctrlBar.className = "ccH5FadeOut";
				},
				toggleFade: function(){
					var _this = this;
					this.addListener(this.oVideo, 'mouseover', function(){_this.ctrlFadeIn();});
					this.addListener(this.oVideo, 'mouseout', function(){_this.ctrlFadeOut();});
					this.addListener(this.ctrlBar, 'mouseover', function(){_this.ctrlFadeIn();});
					this.addListener(this.ctrlBar, 'mouseout', function(){_this.ctrlFadeOut();});
				},
				toggleCtrlBar: function(){
					if(this.ctrlBar.className == "ccH5FadeOut"){
						this.ctrlBar.className = "ccH5FadeIn";
						}
					else{
						this.ctrlBar.className = "ccH5FadeOut";
					}
				},
				timeFormat: function(time){
					var t = parseInt(time),
					h,i,s;
					h = Math.floor(t/3600);
					h = h ? (h + ':') : '';
					i = h? Math.floor(t%3600/60) : Math.floor(t/60);
					s = Math.floor(t%60);
					i = i > 9 ? i : '0'+i;
					s = s > 9 ? s : '0'+s;
					return (h + i + ':' + s);	
				},
				timeupdate: function(){
					if(this.oVideo.currentTime > 0.1){
						this.timeTotal.innerHTML = this.timeFormat(this.oVideo.duration);
					}
					this.timeCurrent.innerHTML = this.timeFormat(this.oVideo.currentTime);
					this.proCurrent.style.width = this.oVideo.currentTime/this.oVideo.duration * this.ctrlWidth + 'px';
				},
				progress: function(){
					if (this.oVideo.buffered && this.oVideo.buffered.length > 0) {
						var progressWidth = Math.round(this.oVideo.buffered.end(0) / this.oVideo.duration * this.ctrlWidth);
						this.loadBar.style.width= progressWidth + 16 + "px";
					}
				},
				setDura: function(v){
					this.oVideo.currentTime = v;
				},
				getPos: function(obj){
					if(obj.getBoundingClientRect){
						var pos = obj.getBoundingClientRect();
						return{
							left : pos.left,
							top : pos.top
						};
					}
					var x = e.offsetLeft, y = e.offsetTop;  
					while(e=e.offsetParent){
						x += e.offsetLeft;  
						y += e.offsetTop;
					}
					return{
						left : x,
						top : y
					};
				},
				getMousePos: function(ev){
					var SupportsTouches = ("createTouch" in document);
					var x = y = 0,
					doc = document.documentElement,
					body = document.body;
					if(!ev) ev=window.event;
					if (window.pageYoffset){
						x = window.pageXOffset;
						y = window.pageYOffset;
					}else{
						x = (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
						y = (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
					}
					if(SupportsTouches){
						var evt = ev.touches.item(0);
						x=evt.pageX;
						y=evt.pageY;
					}else{
						x += ev.clientX;
						y += ev.clientY;
					}
					return{'x' : x, 'y' : y};
				},
				drag: function(el){
					var _this = this;
					el.ontouchstart = el.onmousedown = function(e){
						e.preventDefault();
						document.ontouchmove = document.onmousemove = function(ev){
							ev.preventDefault();
							_this.pause();
							_this.playBtn.hide();
							_this.posDuration(ev);
							_this.oInfo.innerHTML = _this.timeFormat(_this.oVideo.currentTime);
							_this.oInfo.show();
						};
						document.ontouchend = document.onmouseup = function(){
							document.ontouchend = document.onmouseup = document.ontouchmove = document.onmousemove = null;
							_this.oInfo.innerHTML = '';
							_this.oInfo.hide();
							setTimeout(function(){
								_this.play();
							}, 100);
						};
					};
				},
				dragVm: function(el){
					var _this = this;
					el.ontouchstart = el.onmousedown = function(e){
						e.preventDefault();
						document.ontouchmove = document.onmousemove = function(ev){
							ev.preventDefault();
							_this.posVm(ev);
						};
						document.ontouchend = document.onmouseup = function(){
							document.ontouchend = document.onmouseup = document.ontouchmove = document.onmousemove = null;
							
						};
					};
				},
				infoFadeIn: function(){
					var _this = this;
					this.oInfo.show();
					clearInterval(timer);
					var timer = setTimeout(function(){
						_this.oInfo.hide();
					}, 200);
				},
				pre: function(){
					this.oInfo.innerHTML = "<span class='ccH5playerPre'>L</span>5S";
				},
				next: function(){
					this.oInfo.innerHTML = "<span class='ccH5playerNext'>R</span>5S";
				},
				singleTouch: function(e){
					var _this = this;
					e.ontouchstart = function(e){
						e.preventDefault();
						if(e.changedTouches.length == 1){
							var startX = e.changedTouches[0].pageX;
							document.ontouchend = function(){
								document.ontouchend = document.ontouchmove = null;
								if(e.touches.length == 1){
									var endX = e.changedTouches[0].pageX;
									var offset = endX - startX;
									if(_this.oVideo.currentTime != _this.oVideo.duration){
										if(offset < -50) {
											_this.ctrlFadeIn();
											_this.pre();
											_this.infoFadeIn();
											_this.setDura(_this.oVideo.currentTime - 5);
										} else if(offset > 50) {
											_this.ctrlFadeIn();
											_this.next();
											_this.infoFadeIn();
											_this.setDura(_this.oVideo.currentTime + 5);
										}
									}
								}
							};
						}
					};
				},
				posDuration: function(e){
					var mousePos = this.getMousePos(e),
						probarPos = this.getPos(this.progressBar),
						proCurrent = mousePos.x - probarPos.left,
						time = proCurrent/this.ctrlWidth * this.oVideo.duration;
					this.setDura(time);
				},
				setVol: function(v){
					this.oVideo.volume = v;
				},
				posVm: function(e){
					var mousePos = this.getMousePos(e),
						vmbarPos = this.getPos(this.vmBar);
					var h = mousePos.y - vmbarPos.top;
					if(h < 80 && h > 0){
						var t = this.vmPro.style.top = h + 'px';
						var vh = this.vmPro.style.height = 80 - h + 'px';
						vol = ((80 - h) / 80).toFixed(1);
						this.setVol(vol);
					}
				},
				fullScreen: function(){
					if (this.oVideo.requestFullscreen) {
						this.oVideo.requestFullscreen();
					} else if (this.oVideo.msRequestFullscreen) {
						this.oVideo.msRequestFullscreen();
					} else if (this.oVideo.mozRequestFullScreen) {
						this.oVideo.mozRequestFullScreen();
					} else if (this.oVideo.webkitSupportsFullscreen) {
						this.oVideo.webkitEnterFullscreen();
					}
				}
				
			};
			window.oPlayer = new CCHtml5Player();
			oPlayer.init(params.divid);
		},
		showPlayerView: function(video){
			// callback to show video
			var video_div = document.getElementById(video.divid);
			for(var i = 0;i < this.videoInfo.length;i++){
				var params = this.videoInfo[i];
				if(params.divid == video.divid){
					// show video
					video_div.innerHTML = this.getVideoCode(params, video);
					
					if(this.isAndroid() || video.playtype == 1 || this.isIPad() || this.isWindowsPhoneOS()){
						if(video.status == 1){
							var ts = this;	
							this.html5PlayerSkin(params, video, ts);
						}
					}
					
					return;
				}
			}
		}
	};
	// Expose to global
	window.cc_js_Player = new Player();
// End self-executing function
})(window);