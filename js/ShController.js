angular.module('sh.controllers',[])
.controller('ShListController',function ($scope,$http,$ionicPopup,$ionicModal){
    var pageBase = 0;
    var pageSize = 8;
    var shListApi = "http://120.24.218.56/api/sh/list";
    //var shListApi = "http://localhost:8100/js/shlist.json";

    $http.get(shListApi)
        .success(function(newItems) {
            if (newItems.ok == true) {
            	console.log(newItems.data);
                $scope.items = newItems.data;
            }else{
                //else code
            };
        })

    $scope.doRefresh = function (){
	    $http.get(shListApi)
	        .success(function(newItems) {
	            if (newItems.ok == true) {
	            	console.log(newItems.data);
	                $scope.items = newItems.data;
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
                if (newItems.ok == true && newItems.data.length > 0) {
                    for (var i = 0; i < newItems.data.length; i++) {
                        $scope.items.push(newItems.data[i]);
                    }; 
                    var alertPopup = $ionicPopup.alert({
                        title: '友情提示：',
                        template: '刷新成功！'
                    });
                }else if(newItems.ok == true && newItems.data.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: '友情提示：',
                        template: '已经没有更多信息了( ¯ □ ¯ )'
                    });
                }else{
                    var alertPopup = $ionicPopup.alert({
                        title: '友情提示：',
                        template: newItems.message
                    });
                };
	        })
	        .finally(function() {
	            $scope.$broadcast('scroll.infiniteScrollComplete');
	        });
    }

    //modal弹出模态窗口，热门分类
    $ionicModal.fromTemplateUrl('modal-hot.html',function(modal){
        $scope.modalHot = modal;
    },{
        animation: 'slide-in-up'
    });

    //modal弹出模态窗口，分类
    $ionicModal.fromTemplateUrl('modal-class.html',function(modal){
        $scope.modalClass = modal;
    },{
        animation: 'slide-in-up'
    });

    //modal弹出模态窗口，价格
    $ionicModal.fromTemplateUrl('modal-price.html',function(modal){
        $scope.modalPrice = modal;
    },{
        animation: 'slide-in-up'
    });

})


//获取二手物品分类列表
.controller('getShCateListCotroller',function ($scope,GetListService){
    var shCateApi = "http://120.24.218.56/api/sh/cate/list";
    GetListService.getList(shCateApi)
        .success(function (data,status){
            $scope.items = data.data;
        })
    $scope.goList = function(id){
        $location.url("list/"+id); 
    }
})

//获取二手物品单个信息详情
.controller('ShDetailController',function ($scope,$http,$stateParams,$ionicHistory){
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