/*
 *  my.controllers 
 *  Children Controlles Followed：
 *    --IndexController    （主页控制器）
 *    --LoginController    （登录控制器）
 *    --RegisterController （注册控制器）
 *    --MyController       （个人中心控制器）
 *    --feedbackController （意见反馈中心控制器）
 *    --LogoutController   （注销控制器）
*/
angular.module('my.controllers',['ngCordova'])
//个人中心控制器
.controller('IndexController',function ($scope,$ionicModal,$ionicHistory,$state,Auth,GetListService){
    //进入个人中心
    $scope.goToMy = function(){
        var username = Auth.getToken();
        username ? $state.go("my") : $state.go("login");
    }
})

//用户登录，
.controller('LoginController',function ($scope, $state, $timeout, Login, Auth, GetListService){
    $scope.message = "";
    $scope.user = {
        username:null,
        password:null
    }
    $scope.user.rememberMe = true;
    //登录操作
    $scope.login = function(){
        var userApi = "http://120.24.218.56/login?m=1";
        var subdata = "username="+$scope.user.username+"&password="+$scope.user.password+"&rememberMe="+$scope.user.rememberMe;
        Login.new(subdata,userApi)
            .then(function (data){
                if (!data.data.result) {
                    GetListService.alertTip(data.data.message);
                }else{  
                    Auth.setToken(data.data.parm.id);
                    GetListService.alertTip("登录成功！");
                    $timeout(function() {
                        $state.go('/');
                    }, 1500);
                };
            },function (data){
                console.log(data);
            })
    }
    //去注册
    $scope.register = function (){
        $state.go("register");
    }
    
})

//用户注册
.controller('RegisterController',function ($scope, $state, $timeout, Login, Auth, GetListService){
    //去登录
    $scope.login = function (){
        $state.go("login");
    }
})

//个人中心内控制器
.controller('MyController',function ($scope,$state,$ionicModal,Auth,GetListService) {
    var userId = Auth.getToken();
    if (userId) {
        var api = "http://120.24.218.56/api/user/"+userId;
        GetListService.getList(api).then(function(data){
            $scope.user = data.data.data;
            console.log(data.data.data);
        })
    }else{
        $state.go("login");
    };

    //下拉更新资料
    $scope.doRefresh = function (){
        GetListService.userPost(api,data).then(function(data){
            $scope.user = data.data.data;
        })
        .finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    //弹出投稿反馈模态框
    $ionicModal.fromTemplateUrl('feedback.html',function(modal){
        $scope.FeedbackModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
})

//投稿反馈内容提交
.controller('feedbackController',function ($scope,$http,GetListService){
    $scope.feed = {
        content:null,
        email:null
    }
    var url = "http://120.24.218.56/api/feedback/send";
    $scope.addFeedback = function (){
        var subdata = "content="+$scope.feed.content+"&email="+$scope.feed.email;
        GetListService.addFeedback(url,subdata)
            .then(function(data){
                if (data.ok) {
                    console.log(data);
                    GetListService.alertTip("谢谢您，您的反馈信息我们已经收到^_^");
                }else{
                    GetListService.alertTip(data.message);
                }
            })
    }
})

//用户注销
.controller('LogoutController',function ($scope,$state,$ionicPopup,Auth){
    $scope.logout = function (){
       var confirmPopup = $ionicPopup.confirm({
         title: '桃李街提示：',
         template: '确认退出？'
       });
       confirmPopup.then(function(res) {
        console.log(res);
         if(res) {
           Auth.logout();
           $state.go('/');
           console.log("注销成功");
         } else {
           console.log('取消注销');
         }
       });
    }
})

//查看我的个人资料
.controller('MyDetailController',function ($scope, Auth, GetListService, $ionicActionSheet, $cordovaImagePicker){
    var username = Auth.getToken();
    if (username) {
        var api = "http://120.24.218.56/api/user/"+username;
        GetListService.getList(api).then(function(data){
            $scope.user = data.data.data;
            console.log(data.data.data);
        })
    }else{
        $state.go("login");
    };


//=========================
    $scope.images_list = [];  
    // "添加附件"Event  
    $scope.addAttachment = function() {  
        //nonePopover();
        $ionicActionSheet.show({  
            buttons: [{ text: '相机' }, { text: '图库' }  ],  
            cancelText: '关闭', 
            cancel: function() {  
                return true;  
            },  
            buttonClicked: function(index) {  
                switch (index){  
                    case 0:appendByCamera();break;  
                    case 1: pickImage();break;  
                    default:break;  
                }      
                return true;  
            }  
        });  
    }   
    //从相机选取图片
    var appendByCamera = function () {
        navigator.camera.getPicture(function(result) {
           q.resolve(result);
        }, function(err) {
           q.reject(err);
        }, options);
    }
    //image picker  
    var pickImage = function () {  
        var options = {  
            maximumImagesCount: 4,  
            width: 800,
            height: 800,
            quality: 80  
        };  
        $cordovaImagePicker.getPictures(options)  
            .then(function (results) {   
                $scope.images_list.push(results[0]);
            }, function (error) {  
                // error getting photos  
            });
    }
//=========================


})