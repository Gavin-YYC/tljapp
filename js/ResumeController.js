angular.module('resume.controllers',[])
.controller('ResumeListController',function ($scope,$rootScope,$ionicModal,$stateParams,GetListService){
	
    var pageBase = 0;
    var pageSize = 8;
	var resumeApi = "http://120.24.218.56/api/resume/intend/"+$stateParams.id+"?pageNumber="+pageBase+"&pageSize="+pageSize;
	var allResumeApi = "http://120.24.218.56/api/resume/list"+"?pageNumber="+pageBase+"&pageSize="+pageSize;
    //首页加载
    if ($stateParams.id==0) {
        indexApi = allResumeApi;
    }else{
        indexApi = resumeApi;
    };
    GetListService.getList(indexApi)
        .success(function (data,status){
            $scope.items = data.data.list;
        })
    //下拉刷新
    $scope.doRefresh = function (){
		GetListService.getList(indexApi)
	        .success(function (data,status){
	            $scope.items = data.data.list;
                console.log(data.data.list)
	        })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    //上拉更多
    $scope.loadMore = function (){
    	pageBase++;
        if ($stateParams.id==0) {
            api = "http://120.24.218.56/api/resume/list"+"?pageNumber="+pageBase+"&pageSize="+pageSize;
        }else{
            api = "http://120.24.218.56/api/resume/intend/"+$stateParams.id+"?pageNumber="+pageBase+"&pageSize="+pageSize;
        };
        console.log(api);
		GetListService.getList(api)
	        .success(function (data,status){
                if (data.ok == true && data.data.list.length > 0) {
                    $scope.items.push(data.data.list);
                }else if(data.ok == true && data.data.list.length == 0) {
                    GetListService.alertTip("已经没有更多信息了");
                }else{
                    GetListService.alertTip(data.message);
                };
	        })
            .finally(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    }

    //modal弹出模态窗口，求职意向
    $ionicModal.fromTemplateUrl('modal-intend.html',function(modal){
        $scope.IntendModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
})

//获取兼职分类二级目录
.controller('GetJobCateCotroller',function ($scope,$location,$stateParams,GetListService){
	var jobListApi = "http://120.24.218.56/api/job/cate/list";
	GetListService.getList(jobListApi)
        .success(function (data,status){
            $scope.categories = data.data;
        })
    $scope.goList = function(id){
        console.log(id)
        $location.url("resume/"+id);
    }
    $scope.getAllList = function (){
        $location.url("resume/"+0);
    }
})
//按性别进行搜索
.controller('SearchResumeGenderCotroller',function ($scope,$rootScope,GetListService){
    var locations = ["张店区","周村区","淄川区","临淄区","博山区","桓台区","高青区","沂源县"];
    $scope.genders = ["男","女"];
    $scope.locations = locations;
	$scope.genderChange = function (){
        var pageBase = 0;
        var pageSize = 8;
        var gender = $scope.select.gender;
        var api = "http://120.24.218.56/api/resume/gender/"+gender;
        GetListService.getList(api)
            .success(function (data,status){
                console.log(data.data);
                $scope.$emit('toParent',data.data);
                //$rootScope.items = data.data;
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