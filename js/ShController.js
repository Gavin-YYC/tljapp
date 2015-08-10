angular.module('sh.controllers',[])
.controller('ShListController',function ($scope,$http,$ionicModal,GetListService){
    var pageBase = 0;
    var pageSize = 8;
    var shListApi = "http://120.24.218.56/api/sh/list";

    $scope.$on('to-parent', function (event, data){
        $scope.items = data;
    })

    $http.get(shListApi)
        .success(function(newItems) {
            if (newItems.ok == true) {
                $scope.items = newItems.data.list;
            }else{
                //else code
            };
        })

    $scope.doRefresh = function (){
	    $http.get(shListApi)
	        .success(function(newItems) {
	            if (newItems.ok == true) {
                    console.log(newItems.data.list.length);
	                $scope.items.unshift(newItems.data.list);
	            }else{
	                //else code
	            };
	        })
	        .finally(function() {
	            $scope.$broadcast('scroll.refreshComplete');
	        });
    }

    $scope.loadMore = function (){
    	pageBase++;
	    $http.get(shListApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
	        .success(function(newItems) {
                if (newItems.ok == true && newItems.data.list.length > 0) {
                    //$scope.items.push(newItems.data.list);
                }else if(newItems.ok == true && newItems.data.list.length == 0) {
                    GetListService.alertTip("已经没有更多信息了");
                }else{
                    GetListService.alertTip(newItems.message);
                };
	        })
	        .finally(function() {
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
    }
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
})


//获取二手物品分类列表
.controller('getShCateListCotroller',function ($scope,GetListService){
    var price = ['0-10','10-50','50-100','100-500','1000-5000','>5000'];
    $scope.prices = price;
    var shCateApi = "http://120.24.218.56/api/sh/cate/list";
    GetListService.getList(shCateApi).then(function (data){
        $scope.items = data.data.data.list;
    })

    //按照二手物品分类进行搜索
    $scope.classIdChange = function (value){
        if (value == "") {
            return false;
        };
        var api = "http://120.24.218.56/api/sh/category/"+value;
        GetListService.getList(api).then(function (data){
            console.log(data.data.data.list)
            $scope.$emit('to-parent',data.data.data.list);
        })
    }
    $scope.priceChange = function (value){
        if (value == "") {
            return false;
        };
        var api = "http://120.24.218.56/api/sh/search";
    }
})

//获取二手物品单个信息详情
.controller('ShDetailController',function ($scope,$http,$stateParams,$ionicHistory,GetListService){
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    var shApi = "http://120.24.218.56/api/sh/"+$stateParams.id;
    var commentApi = "http://120.24.218.56/api/review/job/"+$stateParams.id;
    GetListService.getDetail(shApi)
        .success(function (data,status){
            $scope.items = data.data;
        })
    GetListService.getComment(commentApi)
        .success(function (data,status){
            $scope.comments = data.data;
        })
})