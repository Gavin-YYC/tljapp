angular.module('route',[])
    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
            //首页
            .state('/',{
                url:'/',
                templateUrl:'templates/index.html',
                controller:'IndexController'
            })
            //兼职列表
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
            //搜索相关
            .state('search',{
                url:'/search',
                templateUrl:'templates/search.html',
                controller:'SearchController'
            })
            //个人简历
            .state('ResumeList', {
                url:'/resume',
                templateUrl:'templates/ResumeList.html'
            })
            .state('ResumeDetail', {
                url:'/resumedetail/:id',
                templateUrl:'templates/ResumeDetail.html',
                controller:'ResumeDetailController'
            })
            //二手物品
            .state('ShList', {
                url:'/sh',
                templateUrl:'templates/ShList.html',
                controller:'ShListController'
            })
            .state('ShDetail', {
                url:'/shdetail/:id',
                templateUrl:'templates/ShDetail.html',
                controller:'ShDetailController'
            })
            //个人中心
            .state('my',{
                url:'/my',
                templateUrl:'templates/my.html',
                controller:'MyController'
            })
        //其他情况，返回首页
        $urlRouterProvider.otherwise('/');
    })