/*
 *
 * list Controller （兼职列表页）
 * api：http://120.24.218.56/api/job/list
 * test api : http://localhost:8100/js/data.js
 *
*/
angular.module('starter.controllers',[])
.controller('ListController',function($scope,$http,$ionicPopup, $timeout){

    var pageBase = 0;
    var pageSize = 8;
    var listApi = "http://120.24.218.56/api/job/list";
    
    $http.get(listApi)
        .success(function(newItems) {
            if (newItems.ok == true) {
                $scope.items = newItems.data;
                console.log(newItems.ok);
            }else{
                //else code
            };
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });

    $scope.doRefresh = function(){
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
    }

})


.controller('DetailController',function($scope,$http){
    $scope.nihao = "nihao";
 })