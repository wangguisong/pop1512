
//server="http://10.200.23.123:80/WebTemplet/file/";
var server="http://kidsfile.popnew.cn/";

function showBanner(){
	Qfast.add('widgets', { path: "js/terminator2.2.min.js", type: "js", requires: ['fx'] });  
	Qfast(false, 'widgets', function () {
		K.tabs({
			id: 'fsD1',   //焦点图包裹id  
			conId: "D1pic1",  //** 大图域包裹id  
			tabId:"D1fBt",  
			tabTn:"a",
			conCn: '.fcon', //** 大图域配置class       
			auto: 0,   //自动播放 1或0
			effect: 'fade',   //效果配置
			eType: 'click', //** 鼠标事件
			pageBt:true,//是否有按钮切换页码
			bns: [],//** 前后按钮配置class                          
			interval: 3000  //** 停顿时间  
		}) 
	})  
	var dd=($("body").width()-$(".fbg").width())/2;
	$(".fbg").css("left",dd);
        	//鼠标的移入移出
	$("#fsD1").mouseenter(function (){
		$(".fbg").fadeIn(1000);
	}).mouseleave(function (){
		$(".fbg").fadeOut(1000);
	});
}

function goTop(){
	scroll(0,0);
}
 function setListData(tmpl,container,data){
 	$(container).empty();	
	$(tmpl)
 		.tmpl( data )
		.appendTo(container);
 }

var videos = [
	{
		id: "v0001",
		img: "images/videoImg.png",
		top: "1",
		vname: "射雕英雄传射雕英雄传射雕英雄传射雕英雄传射雕英雄传英雄传射雕英雄传英雄传射雕英雄传英雄传射雕英雄传",
		author: "令狐冲",
		support: "3000"		
	}
];

//  ========== 
//  =发布= 
//  ========== 
function onSubmitClick(){
	var columnId = $(".selectPanel span").attr("id").split("_")[1];
	var text = $(".upLoadPaneltext").text();
	
	var vname = $(".videoInfo1 span").text();
	var vid = $(".videoInfo1 b").text();
	if(vname == null || vname == ""){
		alert("视频还没有上传完成，请稍后发布！");
		return;
	}
	if(vid == null || vid == ""){
		alert("视频还没有上传完成，请稍后发布！");
		return;
	}
	if(text != null && text != "" && text.length > 0 && text != "视频介绍"){
		var timeAdd = new Date().getTime();
		var data = {};
		data.time = timeAdd;
		data.description = encodeURI(encodeURI(text));
		data.columnId = columnId;
		data.userID = userID;
		data.vname = encodeURI(encodeURI(vname));
		data.vid = vid;
		//请求数据
	   request("TalentShowService","saveTalentShow",data,
			function(data){
				$(".upLoadmask").hide();
				alert(data.message);
				$(".videoInfo1 span").text("");
				$(".videoInfo1 b").text("");
				window.open("myVideo.jsp?userID="+userID);
			},
			function(msg){
				alert(msg);
			}
		);
	}else{
		alert("请输入视屏介绍");
	}
}

//  ========== 
//  =文字判断= 
//  ========== 
function onPaneltextChange(){
	var curLength=$(".upLoadPaneltext").text().length;
   if(curLength>28)
   {
        var num=$(".upLoadPaneltext").text().substr(0,28);
        $(".upLoadPaneltext").text(num);
		$(".tip span").text(28-$(".upLoadPaneltext").text().length);
        alert("超过字数限制，多出的字将被截断！" );
   }
   else
   {
        $(".tip span").text(28-$(".upLoadPaneltext").text().length);
   }
}
//  ========== 
//  =上传视频栏目= 
//  ========== 
function getTalentShowColumnByAll(colId){
	var timeAdd = new Date().getTime();
    var data = {};
    data.time = timeAdd;
 	//请求数据
   request("TalentShowService","talentShowColumnByAll",data,
       function(data){
       	var dataArr = data.data;
		if(dataArr != null && dataArr.length >0){
			$(".selectList ul li").remove();
			for(var i=0;i<dataArr.length;i++){
				var arr = dataArr[i];
				var li = $("<li></li>");
				$(li).attr("id",arr.id);
				$(li).attr("style","border-bottom: 1px solid #cecdcd;");
				$(li).text(arr.name);
				$(li).bind(
					{
						"mouseover" : function(){
							$(this).attr("style","color:red;border-bottom: 1px solid #cecdcd;");
						},
						"mouseout" : function(){
							$(this).attr("style","border-bottom: 1px solid #cecdcd;");
						}
					});
				$(".selectList ul").append(li);
				if(colId != "" && arr.id == colId){
					$(".selectPanel span").text("");
					$(".selectPanel span").text(arr.name);
					var id = "span_"+arr.id;
					$(".selectPanel span").attr("id",id);
				}else{
					if(i==0){
						$(".selectPanel span").text("");
						$(".selectPanel span").text(arr.name);
						var id = "span_"+arr.id;
						$(".selectPanel span").attr("id",id);
					}
				}
				
				li.click(function(){
					$(".selectPanel span").text("");
		            $(".selectPanel span").text($(this).text());
					var id = "span_"+$(this).attr("id");
		            $(".selectPanel span").attr("id",id);
					$(".selectList").slideUp();
				});
			}
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
/*新增视频*/
function ShowColumnByAll(){
	getTalentShowColumnByAll("");
	$(".upLoadPaneltext").text("视频介绍");

	$(".videoInfo1 span").text("");
	$(".videoInfo1 b").text("");
	$(".videoInfo1 p").text("");

	$(".upLoadPaneltext").focus(function(){
      $(".upLoadPaneltext").css("border", "1px solid #fba926");  
    });
    $(".upLoadPaneltext").blur(function(){
      $(".upLoadPaneltext").css("border", "1px solid #cecdcd");
    });

}
/*编辑视频*/
function getvideoByVid(data){
	columnId = data.columnid;
	getTalentShowColumnByAll(data.columnid);
	$(".upLoadPaneltext").text(data.description);

	$(".videoInfo1 span").text(data.name);
	$(".videoInfo1 b").text(data.vid);
	$(".videoInfo1 p").text(data.id);

	$(".upLoadPaneltext").focus(function(){
      $(".upLoadPaneltext").css("border", "1px solid #fba926");  
    });
    $(".upLoadPaneltext").blur(function(){
      $(".upLoadPaneltext").css("border", "1px solid #cecdcd");
    });

}
