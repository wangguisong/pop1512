var bookid;
var currentUnit;

$(function(){
	bookid=getQuery("id");
	userID = getCookie("userID");
	webAppId = getCookie("webAppId");
	timeOffset = getCookie("timeOffset");
	appPwd= getCookie("appPwd");
	
	setCookie("currentBookId",bookid);
	
	getUnits ();
	
})

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
			firstUnit.trigger("click");
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
function onClickUnit () {
	if(currentUnit!=null)
	{
		$(currentUnit).removeClass("navOn");
	}
	currentUnit=this;
	$(this).addClass("navOn");
	var unitName=$(this).text();
	var obj={
		name:unitName.substr(0,4),
		num:unitName.substr(4)
	};
	var arr=[obj];
	setListData("#titleTmpl",".unitTitle",arr);	
	getVideos(unitName);
	setCookie("currentUnitName",unitName);
	
}
function getVideos (unitName) {
	//请求数据
   request("ResourceService","getVideos",{bookid:bookid,unitName:unitName},
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
			//$(".navItem").click(onClickUnit);
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
