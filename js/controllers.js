/*
 *
 * list Controller （兼职列表页）
 * api：http://120.24.218.56/api/job/list
 * test api : http://localhost:8100/js/data.js
 *
*/
angular.module('starter.controllers',[])
.controller('ListController',function($scope,$http,$ionicPopup, $timeout,$ionicModal,$stateParams){

    //初始化 请求页面参数
    var pageBase = 0;
    var pageSize = 8;
    var cateId = $stateParams.id;
    var listApi = "http://120.24.218.56/api/job/list";
    var cateListApi = "http://120.24.218.56/api/job/category/"+cateId;

    if (cateId == 0) {
        //列表页加载时产生的数据
        $http.get(listApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    console.log(newItems);
                    $scope.items = newItems.data;
                    console.log($scope.items);
                }else{
                    //else code
                };
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }else{
        $http.get(cateListApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    $scope.items = newItems.data;
                }else{
                    //else code
                };
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
    


    //下拉更新操作，数据更新，并进行提示
    $scope.doRefresh = function(){
        if (cateId==0) {
            pageBase++;
            $http.get(listApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
                .success(function(newItems) {
                    if (newItems.ok == true && newItems.data.length > 0) {
                        for (var i = 0; i < newItems.data.length; i++) {
                            $scope.items.unshift(newItems.data[i]);
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
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }else{
            pageBase++;
            $http.get(cateListApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
                .success(function(newItems) {
                    if (newItems.ok == true && newItems.data.length > 0) {
                        for (var i = 0; i < newItems.data.length; i++) {
                            $scope.items.unshift(newItems.data[i]);
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
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    }

    //modal弹出模态窗口，用于选择分类、结算和区域
    $ionicModal.fromTemplateUrl('modal.html',function(modal){
        $scope.modal = modal;
    },{
        animation: 'slide-in-up'
    })

})

/*
 *
 * Detail Controller （兼职详情页）
 * api：http://120.24.218.56/api/job/
 * test api : http://localhost:8100/js/detail.json
 *
*/
.controller('DetailController',function($scope,$http,$stateParams){
    $scope.id = $stateParams.id;
    var jobApi = "http://120.24.218.56/api/job/";

    $http.get(jobApi+$scope.id)
        .success(function(jobDetail){
            if (jobDetail.ok == true) {
                $scope.item = jobDetail.data;
                console.log($scope.item);
            };
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
 })

/*
 *
 * Detail Controller （兼职详情页）
 * api：http://120.24.218.56/api/job/cate/list
 * test api : http://localhost:8100/js/category.json
 *
*/
.controller('getCategoriesCotroller',function($scope,$http,$state){

    var categoryApi = "http://120.24.218.56/api/job/cate/list";

    $http.get(categoryApi)
        .success(function(newItems) {
            if (newItems.ok == true) {
                $scope.categories = newItems.data;
                console.log($scope.categories);
            }else{
                //else code
            };
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });

    $scope.goList = function(id){
        console.log(id)
    }
})