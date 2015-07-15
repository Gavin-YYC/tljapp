angular.module('starter.controllers',[])
.controller('ListController',function($scope,$http){
        $scope.items = [
            {type:1,title:"你好倒萨这时测试ְ",gongzi:'20/天',location:"张店",date:'2015-1-28:18:00',gztype:"日结"},
            {type:1,title:"你好倒萨这时测试",gongzi:'200/天',location:"张店",date:'2015-1-28:18:00',gztype:"日结"},
            {type:1,title:"sfdfdsfsdfsd",gongzi:'2000/天',location:"张店",date:'2015-1-28:18:00',gztype:"日结"}
        ];
        $scope.doRefresh = function() {
            for(var i = 0;i<10;i++,base.type++){
                var base = {type:base,id:Math.ceil(Math.random(100,999)*100),title:"sfdfdsfsdfsd"+i,gongzi:'2000/天',location:"张店",date:'2015-1-28:18:00',gztype:"日结"};
                $scope.items.unshift(base);
                console.log(base);
                $scope.$broadcast('scroll.refreshComplete');
            }
            /*
            $http.get('#')
                .success(function(newItems) {
                    $scope.items = newItems;
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            */
        };
})
.controller('DetailController',function($scope,$http){
    $scope.nihao = "nihao";
 })