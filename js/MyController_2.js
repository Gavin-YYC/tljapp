/*  This is my_2.controller
 *  Here is some controller in this file.
 *    --MyMessage		   （我的通知、信息）
 *-----------------------------------------
 *  my.controllers 
 *  Children Controlles Followed：
 *=========================================
 *    --IndexController    （主页控制器）
 *    --LoginController    （登录控制器）
 *    --RegisterController （注册控制器）
 *    --MyController       （个人中心控制器）
 *    --ChildPageController（个人中心进入各分页面路口）
 *    --FeedbackController （意见反馈中心控制器）
 *    --LogoutController   （注销控制器）
 *    --PostController     （发布兼职信息）
 *    --MyPostController   （我的发布）
 *    --MyFavController    （我的收藏）
 *    --ChangePwdController（修改密码）
 *=========================================+
*/
angular.module('my_2.controllers',[])
//我的个人信息
.controller('MyMessage', function ($scope, Auth, $ionicHistory, $timeout, GetListService){
	//列表页可滑动
 	$scope.listCanSwipe = true;
 	$scope.shouldShowDelete = false;
 	//显示更多
 	$scope.doAllOperation = function (){
 		$scope.shouldShowDelete = !$scope.shouldShowDelete;
 	}
 	//返回上一步
 	$scope.doBack = function (){
 		$ionicHistory.goBack();
 	}
 	//加载内容
    var username = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "&appToken="+token;
    var unReadApi = "http://120.24.218.56/api/noti/pri/unread?memberId="+username+tokenKey;
 	var messageApi = "http://120.24.218.56/api/noti/pri?memberId="+username+tokenKey;
 	loadIndex();
 	//下拉刷新
 	$scope.doRefresh = function(){
 		$timeout(loadIndex(),1000);
 		$scope.$broadcast('scroll.refreshComplete');
 	}
 	function loadIndex(){
	    GetListService.getList(messageApi).then(function (data){
	        $scope.unreads = data.data.data.list;
	        var length = data.data.data.list.length;
	        var resultCount = data.data.data.resultCount;
	        $scope.emptyContent = GetListService.hasNextPage(length,resultCount);
	    })
 	}
    //加载更多
    //初始化分页参数
    var pageNumber = 0;
    var pageSize = 8;
    $scope.loadMore = function(index){
        pageNumber++;
        var pageKey = "&pageNumber="+pageNumber+"&pageSize="+pageSize;
        //加载转换
        switch (index){
            case "sys":
                var api = messageApi;
                var items = "unreads";
            break;
            case "per":
                var api = myShApi;
                var items = "shItems";
            break;
        }
        //发起请求
        GetListService.getList(api+pageKey).then(function (data){
            $scope[items] = $scope[items].concat(data.data.data.list);
            var length = data.data.data.list.length;
            var resultCount = data.data.data.resultCount;
            console.log(length);
            console.log(resultCount)
            $scope.emptyContent = GetListService.hasNextPage(length,resultCount);
        })
    }
 	
})
//标记为已读或者删除
.controller("markOrDelete", function ($scope, Auth, GetListService){
	//标记为已读
    var username = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "appToken="+token;
	$scope.mark = function (id){
		var api = "http://120.24.218.56/api/noti/sys/mark";
		var data = "notiId="+id;
		console.log(data);
        GetListService.userPut(api,data).then(function (data){
        	console.log(data);
        })
	}
})
//个人信息详情
.controller('MyMessageDetail', function ($scope, $ionicHistory, $stateParams){
 	//返回上一步
 	$scope.doBack = function (){
 		$ionicHistory.goBack();
 	}
 	//加载详情
 	var messageId = $stateParams.id;
 	$scope.id = messageId;
 	var messageApi = "";
})