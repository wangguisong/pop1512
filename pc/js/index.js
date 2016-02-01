
$(function(){
//	userID = getQuery("userID");
//	webAppId = getQuery("webAppId");
//	timeOffset = getQuery("timeOffset");
//	appPwd= getQuery("appPwd");
	userID = '000000004b0b102f014b1084ef2c0002';
	webAppId = 207;
	timeOffset = '1453384476274';
	appPwd = '4191AA0AA074F5B3DE3E83F4C29096E1';
	setCookie("userID",userID);
	setCookie("webAppId",webAppId);
	setCookie("timeOffset",timeOffset);
	setCookie("appPwd",appPwd);
	
	getAllBooks();
	

	
});

//  ========== 
//  =展示视频栏目= 
//  ========== 
function getAllBooks(){
 	//请求数据
   request("ResourceService","getResourceBooks",{},
       function(data){
       	var dataArr = data.data;
		if(dataArr != null && dataArr.length >0){
			//$(".videoContainer").empty();
			var vieoArr=[],audioArr=[];
			for (var i = 0; i < dataArr.length; i++) {
				dataArr[i].img=server+dataArr[i].img;
				if(dataArr[i].type==0)
				{
					vieoArr.push(dataArr[i]);
				}
				else
				{
					audioArr.push(dataArr[i]);
				}
			}
			setListData("#bookItemTmpl","#videoContainer",vieoArr);	
			setListData("#bookItemTmpl2","#audioContainer",audioArr);
			
		}
       },
       function(msg){
		  alert(msg);
	   }
    );
}
