//验证参数
var userID;
var webAppId;
var timeOffset;
var serverIp;

$(document).ready(function(){
	checkMobile();     //检查是否为手机	
	userID = getQuery("userID");
	webAppId = getQuery("webAppId");
	timeOffset = getQuery("timeOffset");
//	if(userID==null || webAppId==null || timeOffset==null){
//		$("body").text("参数错误！");
//		return;
//	}
//	serverIp = getQuery("serverIp");
//  if(serverIp && serverIp!=""){
//      URL = serverIp + "actionService/gateway";
//  }
    onResize();
    //关闭按钮
    addTapEvent($("#close")[0],function(){
    	closeWindow();
    })
});

$(window).resize(onResize);

function onResize(){
   footerLayout();
   contentLayout();
   layoutAppIcon();
}

function footerLayout(){
	var allW = $(window).width();
	var liW = allW/3;
	$("footer li").width(liW);
}
function contentLayout(){
	var allH = $(window).height();
	$(".content").height(allH-31-46);
}



function layoutAppIcon(){
	var allW = $(window).width();
	var li = $("#applist li");
	var liW = li.width();
	var count = Math.floor((allW/liW));
    var left = (allW - (liW*count))/2;
	li.css("left",left);
//	var margin = (allW - (liW*3))/3;
//	li.css("margin-left",margin);

}
