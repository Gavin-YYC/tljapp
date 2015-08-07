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
  })
})
.constant('ACCESS_LEVELS', {
    pub: 1,
    user: 2
})
.config(function ($httpProvider) {
    //拦截器
    var interceptor = function ($q, $rootScope, Auth) {
        return {
            'response': function (resp) {
                if (resp.config.url == '/api/login') {
                    // 假设API服务器返回的数据格式如下:
                    // { token: "AUTH_TOKEN" }
                    Auth.setToken(resp.data.token);
                }
                return resp;
            },
            'responseError': function (rejection) {
                // 错误处理
                switch (rejection.status) {
                    case 401:
                        if (rejection.config.url !== '#/tab/user/login')
                        // 如果当前不是在登录页面
                            $rootScope.$broadcast('auth:loginRequired');
                        break;
                    case 403:
                        $rootScope.$broadcast('auth:forbidden');
                        break;
                    case 404:
                        $rootScope.$broadcast('page:notFound');
                        break;
                    case 500:
                        $rootScope.$broadcast('server:error');
                        break;
                }
                return $q.reject(rejection);
            }
        };
    };


    // 将拦截器和$http的request/response链整合在一起
    $httpProvider
        .interceptors.push(interceptor);
        var timestampMarker = function ($rootScope) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loadingShow')
                    return config;
                },
                response: function (response) {
                    $rootScope.$broadcast('loadingHide')
                    return response;
                }
            }
        };
    $httpProvider.interceptors.push(timestampMarker)
})