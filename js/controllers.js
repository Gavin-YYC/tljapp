angular.module('starter.controllers',[])
.controller('ListController',function($scope,$http){
        $scope.items = [
            {type:1,title:"��ְ��ְ��ְ��ְ��ְ",gongzi:'2000/��',location:"�ŵ�",date:'2015-1-28:18:00',gztype:"����ս�"},
            {type:1,title:"��������������ʹ�����",gongzi:'2000/��',location:"�ŵ�",date:'2015-1-28:18:00',gztype:"����ս�"},
            {type:1,title:"sfdfdsfsdfsd",gongzi:'2000/��',location:"�ŵ�",date:'2015-1-28:18:00',gztype:"����ս�"}
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
                    // ֹͣ�㲥ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            */
        };
})