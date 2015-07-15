angular.module('starter.controllers',[])
.controller('ListController',function($scope,$http){
        $scope.items = [
            {type:1,title:"兼职兼职兼职兼职兼职",gongzi:'2000/天',location:"张店",date:'2015-1-28:18:00',gztype:"题解日结"},
            {type:1,title:"打击倒萨发而访问过若干",gongzi:'2000/天',location:"张店",date:'2015-1-28:18:00',gztype:"题解日结"},
            {type:1,title:"sfdfdsfsdfsd",gongzi:'2000/天',location:"张店",date:'2015-1-28:18:00',gztype:"题解日结"}
        ];
        var base = 1;
        $scope.doRefresh = function() {
            for(var i = 0;i<10;i++,base++){
                $scope.items.unshift(["item",base].join(""));
                $scope.$broadcast('scroll.refreshComplete');
            }
            /*
            $http.get('#')
                .success(function(newItems) {
                    $scope.items = newItems;
                })
                .finally(function() {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            */
        };
})