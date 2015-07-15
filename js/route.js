angular.module('route',[])
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('/',{
                url:'/',
                templateUrl:'templates/index.html'
            })
            .state('list', {
                url:'/list',
                templateUrl:'templates/list.html',
                controller:'ListController'
            })

        $urlRouterProvider.otherwise('/');
    })