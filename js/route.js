angular.module('route',[])
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('/',{
                url:'/',
                templateUrl:'templates/index.html'
            })
            .state('list', {
                url:'/list/:id',
                templateUrl:'templates/list.html',
                controller:'ListController'
            })
            .state('detail',{
                url:'/detail/:id',
                templateUrl:'templates/detail.html',
                controller:'DetailController'
            })

        $urlRouterProvider.otherwise('/');
    })