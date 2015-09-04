// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('tljApp', [
    'ionic',
    'route',
    'user.service',
    'getlist.service',
    'starter.controllers',
    'resume.controllers',
    'sh.controllers'
])

.run(function($rootScope, $ionicPlatform, $ionicHistory) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
		//启动极光推送服务 
		window.plugins.jPushPlugin.init(); 
		//调试模式 
		window.plugins.jPushPlugin.setDebugMode(true); 
    })
})
.constant('ACCESS_LEVELS', {
    pub: 1,
    user: 2
})

//loading
.factory('timestampMarker', ["$rootScope","$timeout", function ($rootScope, $timeout) {
    var timestampMarker = {
        request: function (config) {
            //$rootScope.loading = true;
            return config;
        },
        response: function (response) {
            //$rootScope.loading = false;
            return response;
        }
    };
    return timestampMarker;
}])
.config(['$httpProvider',function ($httpProvider){
    $httpProvider.interceptors.push('timestampMarker');
}])

//自定义时间过滤器
.filter('timeFileter',function (){
    //如果是当天 显示几分钟前
    return function (date){
        var post = new Date(date);
        var date= new Date();
        var time =date.getTime() - post.getTime();
        if(time < 0){
            return "1分钟前";
        }
        if (date.getDate() === post.getDate() && time < 86400000) {
            if (time < 60 * 60 * 1000) {
                return Math.ceil(time / (60 * 1000)) + "分钟前";
            } else {
                return Math.ceil(time / (60 * 60 * 1000))+ "小时前";
            }
        }else{
            var month  = post.getMonth()+1;
            var day = post.getDate();
            if (month<10) month = "0"+month;
            if (day < 10) day = "0"+day;
            return (month)+"-"+day;
        }
        return time;
    }
})