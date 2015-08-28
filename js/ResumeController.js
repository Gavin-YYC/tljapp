angular.module('resume.controllers',[])
.controller('ResumeListController',function ($scope, $stateParams, GetListService){
    //初始化分页数据
    var pageBase = 0;
    var pageSize = 8;
	var allResumeApi = "http://120.24.218.56/api/resume/list";

    //接收从子控制器中传来的数据（选择分类等）
    $scope.$on('to-parent', function (event, data){
        //配置全局搜索Api
        $scope.loadMoreApi = data.api;
        if (data == "") {
            $scope.items = data.list;
            $scope.emptyContent = true;
        }else{
            $scope.items = data.list;
            $scope.emptyContent = false;
        };
        checkNext(data.list.length);
    })
    //页面初始化
    GetListService.getList(allResumeApi).then(function (data){
        $scope.items = data.data.data.list;
        checkNext(data.data.data.list.length);
    })
    //页面下拉刷新
    $scope.doRefresh = function (){
        //如果有搜索Api，则刷新搜索页面，否则为普通列表
        var api = $scope.loadMoreApi ? $scope.loadMoreApi : allResumeApi;
        console.log(api);
        GetListService.getList(api).then(function (data){
            $scope.items = data.data.data.list;
            checkNext(data.data.data.list.length);
        }).finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
        });
    }
    //加载更多
    $scope.loadMore = function (){
        pageBase++;
        var pageKey = "?pageNumber="+pageBase+"&pageSize="+pageSize;
        var api = $scope.loadMoreApi ? $scope.loadMoreApi+pageKey : allResumeApi+pageKey;
        console.log(api);
        GetListService.getList(api).then(function (data){
            $scope.items = $scope.items.concat(data.data.data.list);
            checkNext(data.data.data.list.length);
        })
    }
    //如果列表结果小于8，则加载下一页
    function checkNext(resultCount){
        if (resultCount == 8) {
            $scope.emptyContent = false;
        }else{
            $scope.emptyContent = true;
        }
    }

})
//按性别进行搜索
.controller('SearchResumeGenderCotroller',function ($scope, GetListService){
    var locations = ["张店区","周村区","淄川区","临淄区","博山区","桓台区","高青区","沂源县"];
    $scope.genders = ["男","女"];
    $scope.locations = locations;
    //初始化页面参数
    var pageBase = 0;
    var pageSize = 8;
    //根据性别进行搜索
	$scope.goGender = function (value){
        var api = "http://120.24.218.56/api/resume/gender/"+value+"?pageNumber="+pageBase+"&pageSize="+pageSize;
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.gender = !$scope.selecting.gender;
        })
	}
    //根据地区进行搜素
    $scope.goLocation = function (value){
        var api = "";
        console.log(value);
        $scope.selecting.location = !$scope.selecting.location;
    }
    //获取意向列表
    var jobListApi = "http://120.24.218.56/api/job/cate/list";
    GetListService.getList(jobListApi).then(function (data){
        $scope.intends = data.data.data.list;
    })
    //按照求职意向进行搜索
    $scope.goIntend = function(value){
        console.log(value);
        var resumeApi = "http://120.24.218.56/api/resume/intend/"+value;
        GetListService.getList(resumeApi).then(function (data){
            data.data.data.api = resumeApi;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.intend = !$scope.selecting.intend;
        })
    }
})
//二级目录下的子控制器
.controller("getIntendAndGenderCotroller", function ($scope, GetListService){
    //初始化：隐藏二级选项菜单
    $scope.selecting = {
        location:false,
        gender:false
    }
    //显示二级选项菜单
    $scope.showModal = function (value){
        if (value == "location")
            $scope.selecting.location = !$scope.selecting.location;
        if (value == "intend") 
            $scope.selecting.intend = !$scope.selecting.intend;
        if (value == "gender") 
            $scope.selecting.gender = !$scope.selecting.gender;
    }
    //显示所有信息
    $scope.loadAll = function (value){
        var api = "http://120.24.218.56/api/resume/list";
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting[value] = !$scope.selecting[value];
        })
    }
})
//查询简历详情
.controller('ResumeDetailController',function ($scope,$stateParams,$ionicHistory,GetListService){
	var resumeDetailApi = "http://120.24.218.56/api/resume/"+$stateParams.id;
	GetListService.getList(resumeDetailApi)
        .success(function (data,status){
            $scope.items = data.data;
        })
    //下拉刷新
    $scope.doRefresh = function (){
		GetListService.getList(resumeDetailApi)
	        .success(function (data,status){
	            $scope.items = data.data;
	        })
	        .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
	$scope.myGoBack = function (){
		$ionicHistory.goBack();
	}
})