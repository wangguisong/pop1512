var bookid;
var currentUnit;

var isMoving = false;
$(function(){
	bookid=getQuery("id");
	userID = getCookie("userID");
	webAppId = getCookie("webAppId");
	timeOffset = getCookie("timeOffset");
	appPwd= getCookie("appPwd");
	
	setCookie("currentBookId",bookid);
	
	getUnits ();
	
	$(window).resize(layoutContainer);
	document.onscroll = function(){
		if(isMoving) return;
		var st = $('html').scrollTop();
		if(st==0){
			st = $('body').scrollTop();
		}
		var top = parseInt($('.unitHead').height())+parseInt($('.unitHead').css('margin-top'));
		var list = $('.unitTitle');
		for(var i=0; i<list.length; i++){
			var it = $(list[i]).offset().top;
			if(Math.abs(st-it+top) < 30){
				var ulist = $('.navItem')
				for(var j=0; j<ulist.length; j++){
					if($(ulist[j]).hasClass('navOn')){
						$(ulist[j]).removeClass("navOn");
					}
					if(j==i){
						$(ulist[j]).addClass("navOn");
					}
				}
				break;
			}
		}
	}
})

function gotoElementByClass(obj){
	var top = parseInt($('.unitHead').height())+parseInt($('.unitHead').css('margin-top'));
	var _targetTop = $('.'+obj).offset().top-top;
	isMoving = true;
    jQuery("html,body").animate({scrollTop:_targetTop},300,'linear',function(){isMoving=false;});
}

function layoutContainer(){
	//var h = $('#navigator').height();
	//$('.container').css('margin-top', (h+115)+'px');
}

function getUnits () {
	//请求数据
   request("ResourceService","getUnits",{bookid:bookid},
       function(data){
       	var dataArr = data.data;
		if(dataArr != null && dataArr.length >0){
			//$(".navigator").empty();			
			setListData("#unitItemTmpl","#navigator",dataArr);	
			$(".navItem").click(onClickUnit);
			var firstUnit=$('#navigator').find(".navItem").first();
			
			layoutContainer();
			for(var i=0; i<dataArr.length; i++){
				var uTitle = $('<div class="unitTitle uTitle'+i+'"></div>');
				$('.container').append(uTitle);
				var l1 = $('<div class="line"></div>');
				$('.container').append(l1);
				var l2 = $('<div class="line2"></div>');
				$('.container').append(l2);
				var list = $('<div class="list list'+i+'"></div>');
				$('.container').append(list);
				var unitName=dataArr[i].name;
				var obj={
					name:unitName.substr(0,4),
					num:unitName.substr(4)
				};
				var arr=[obj];
				setListData("#titleTmpl",".uTitle"+i,arr);	
				getVideos(unitName, '.list'+i);
				$($('.navItem')[0]).addClass("navOn");
			}
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
function onClickUnit () {
	var ulist = $('.navItem')
	for(var j=0; j<ulist.length; j++){
		if($(ulist[j]).hasClass('navOn')){
			$(ulist[j]).removeClass("navOn");
		}
	}
	$(this).addClass("navOn");
	var list = $('.navItem');
	for(var i=0; i<list.length; i++){
		if(list[i] == this){
			gotoElementByClass('list'+i);
			break;
		}
	}
//	setCookie("currentUnitName",unitName);
	
}
function getVideos (unitName, ctn) {
	//请求数据
   request("ResourceService","getVideos",{bookid:bookid,unitName:unitName},
       function(data){
       	var dataArr = data.data;
		if(dataArr != null && dataArr.length >0){
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
				dataArr[i].unitName = unitName;
			}
			setListData("#videoItemTmpl",ctn,dataArr);	
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
