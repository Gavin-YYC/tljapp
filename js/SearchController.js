/* 兼职搜索页面控制器 */
angular.module('search.controllers',[])
.controller('SearchController',function ($scope,$http,$ionicModal,$stateParams,GetListService){
    var pageBase = 0;
    var pageSize = 8;
    var searchApi = "http://120.24.218.56/api/job/search";
    //对传来的数据进行重组
    if ($stateParams.type == "region") {
        $stateParams.id = "string:"+$stateParams.id;
    };
    var key = "?"+$stateParams.type+"="+$stateParams.id;
    //发起页面请求
    $http.get(searchApi+key+"&pageNumber="+pageBase+"&pageSize="+pageSize)
        .success(function(newItems) {
            console.log(newItems);
            if (newItems.ok == true) {
                $scope.items = newItems.data.list;
            }else{
                //else code
            };
        })
    //下拉刷新内容
    $scope.doRefresh = function (){
        pageBase++;
        $http.get(searchApi+key+"&pageNumber="+pageBase+"&pageSize="+pageSize)
            .success(function(newItems) {
                console.log(searchApi+key+"&pageNumber="+pageBase+"&pageSize="+pageSize);
                if (newItems.ok == true && newItems.data.list.length > 0) {
                    for (var i = 0; i < newItems.data.list.length; i++) {
                        $scope.items.unshift(newItems.data.list[i]);
                    }; 
                    GetListService.alertTip("刷新成功！");
                }else if(newItems.ok == true && newItems.data.list.length == 0) {
                    GetListService.alertTip("已经没有更多信息了");
                }else{
                    GetListService.alertTip(newItems.message);
                };
            })
            .finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }
    //上拉更多内容
    $scope.loadMore = function (){
        pageBase++;
        $http.get(searchApi+key+"&pageNumber="+pageBase+"&pageSize="+pageSize)
            .success(function(newItems) {
                if (newItems.ok == true && newItems.data.length > 0) {
                    console.log(newItems.data);
                    $scope.items.push(newItems.data);
                }else if(newItems.ok == true && newItems.data.length == 0) {
                    GetListService.alertTip("已经没有更多信息了");
                }else{
                    GetListService.alertTip(newItems.message);
                };
            })
            .finally(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    }

    //modal弹出模态窗口，用于选择分类
    $ionicModal.fromTemplateUrl('modal-type.html',function(modal){
        $scope.modalType = modal;
    },{
        animation: 'slide-in-up'
    });
})