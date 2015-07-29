angular.module('resume.controllers',[])
.controller('ResumeListController',function ($scope,$ionicModal,$stateParams,GetListService){
	
	var pageBase = 0;
    var pageSize = 8;
	var resumeApi = "http://120.24.218.56/api/resume/intend/"+$stateParams.id+"?pageNumber="+pageBase+"&pageSize="+pageSize;
	GetListService.getList(resumeApi)
        .success(function (data,status){
            $scope.items = data.data;
        })
    //下拉刷新
    $scope.doRefresh = function (){
		GetListService.getList(resumeApi)
	        .success(function (data,status){
	        	console.log(data);
	            $scope.items = data.data;
	        })
	        .error(function (data){
	        	GetListService.alertTip(data);
	        })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    //上拉更多
    $scope.loadMore = function (){
    	pageBase++;
		var resumeApi = "http://120.24.218.56/api/resume/intend/"+$stateParams.id+"?pageNumber="+pageBase+"&pageSize="+pageSize;
		GetListService.getList(resumeApi)
	        .success(function (data,status){
                if (data.ok == true && data.data.length > 0) {
                    $scope.items.push(data.data);
                }else if(data.ok == true && data.data.length == 0) {
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

    //modal弹出模态窗口，性别分类
    $ionicModal.fromTemplateUrl('modal-gender.html',function(modal){
        $scope.GenderModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });

    //modal弹出模态窗口，按地区分类
    $ionicModal.fromTemplateUrl('modal-area.html',function(modal){
        $scope.AreaModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
})

.controller('GetJobCateCotroller',function ($scope,$location,$stateParams,GetListService){
	var jobListApi = "http://120.24.218.56/api/job/cate/list";
	GetListService.getList(jobListApi)
        .success(function (data,status){
        	console.log(data.data);
            $scope.categories = data.data;
        })
    $scope.goList = function(id){
        $location.url("resume/"+id);
    }
})

.controller('SearchResumeGenderCotroller',function ($scope,GetListService){
	$scope.genders = ["男","女"];
	$scope.getGender = function (gender){
		console.log(gender);
	}
})

.controller('ResumeDetailController',function ($scope,$stateParams,$ionicHistory,GetListService){
	var resumeDetailApi = "http://120.24.218.56/api/resume/"+$stateParams.id;
	GetListService.getList(resumeDetailApi)
        .success(function (data,status){
        	console.log(data.data);
            $scope.items = data.data;
        })
    //下拉刷新
    $scope.doRefresh = function (){
		GetListService.getList(resumeDetailApi)
	        .success(function (data,status){
	        	console.log(data.data);
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