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
        $state.go("my",{},{reload: true});
    }
})

//用户登录，
.controller('LoginController',function ($scope, $ionicHistory, $state, $timeout, Login, Auth, GetListService){
    $scope.message = "";
    $scope.user = {
        username:null,
        password:null
    }
    $scope.user.rememberMe = true;
    //登录操作
    $scope.login = function(){
        var userApi = "http://120.24.218.56/login";
        var subdata = "username="+$scope.user.username+"&password="+$scope.user.password+"&rememberMe="+$scope.user.rememberMe+"&m=1";
        Login.new(subdata,userApi)
            .then(function (data){
                if (!data.data.result) {
                    GetListService.alertTip(data.data.message);
                }else{
                    Auth.setUser(data.data.parm.id);
                    Auth.setToken(data.data.parm.appToken);
                    GetListService.alertTip("登录成功！");
                    $timeout(function() {
                        $state.go("/");
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
    //后退一步
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    
})

//用户注册
.controller('RegisterController',function ($scope, $ionicHistory, $state, $timeout, GetListService){
    //去登录
    $scope.login = function (){
        $state.go("login");
    }
    //上一页
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    //配置页面错误提示
    $scope.hasErr = false;
    $scope.err = {
        msg:""
    }
    //初始化注册表单
    $scope.reg = {
        username : "",
        password : "",
        rePassword: "",
        userType : "false"
    }
    //注册事件
    $scope.register = function (reg){
        var api = "http://120.24.218.56/register";
        var data = "username="+reg.username+"&password="+reg.password+"&rePassword="+reg.rePassword+"&isEmployer="+reg.userType;
        console.log(data);
        GetListService.userPost(api, data).then(function (data){
            $scope.hasErr = true;
            if (!data.result) {
                $scope.color = "#fff";
                $scope.bgColor = "#ef473a";
                $scope.err.msg = data.message;
                if (data.parm) {
                    $scope.err.msg = data.parm.username+'\n'+data.parm.password;
                };
            }else{
                $scope.color = "#fff";
                $scope.bgColor = "#33cd5f";
                $scope.err.msg = "注册成功！";
                GetListService.alertTip("注册成功！");
                $timeout(function (){
                    $state.go("login");
                },1500)
            }
        })
    }
})

//个人中心内控制器
.controller('MyController',function ($scope, $state, $ionicModal, $ionicHistory, Auth, GetListService) { 
    //用户是否登录验证
    var userId = Auth.getUser();
    if (userId != "") {
        var api = "http://120.24.218.56/api/user/"+userId;
        GetListService.getList(api).then(function(data){
            $scope.user = data.data.data;
            $scope.noLogin = false;
            $scope.bgColor = "";
        })
    }else{
        //显示登录或者个人中心
        $scope.noLogin = true;
        $scope.bgColor = "#eee";
    }
    //返回上一页
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    };
    //弹出投稿反馈模态框
    $ionicModal.fromTemplateUrl('feedback.html',function(modal){
        $scope.FeedbackModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    })
})

.controller('ChildPageController',function ($scope, $state, Auth){
    //进入分页面
    $scope.myGoTo = function (ChilePage){
        var userId = Auth.getToken()||"";
        if (userId) {
            switch (ChilePage){
                case "myPost":
                    $state.go("post");
                break;
                default:
                    console.log("nhaos");
                break;
            }
        }else{
            $state.go("login")
        }
    }
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
.controller('MyDetailController',function ($scope, Auth, GetListService, $cordovaCamera, $ionicActionSheet, $cordovaImagePicker, $cordovaFileTransfer){
    var username = Auth.getUser() || "";
    console.log(username);
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
            buttons: [{ text: '相机' }, { text: '图库' }],  
            cancelText: '取消', 
            cancel: function() {  
                return true;  
            },  
            buttonClicked: function(index) {  
                switch (index){  
                    case 0: $scope.takePhoto();break;  
                    case 1: pickImage();break;  
                    default:break;  
                }      
                return true;  
            }  
        });  
    }   
    //从相机选取图片
    $scope.takePhoto = function () {
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth: 600,
            targetHeight: 800
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            alert(imageURI);
            $scope.images_list.push(imageURI)
        }, function (err) {
            // error
        });
    }
    //image picker  
    var pickImage = function () {  
        var options = {  
            maximumImagesCount: 4,  
            width: 600,
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

//发布兼职信息
.controller("PostController",function ($scope, $ionicActionSheet, $ionicSlideBoxDelegate){
    $scope.job = {
        typeToPay:"",
        typeArea:"",
        type:"",
        moneyAndTime: "元/时"
    };
    $scope.goNext = function(index){
        $ionicSlideBoxDelegate.next();
    }
    $scope.goPrevious = function(index){
        $ionicSlideBoxDelegate.previous();
    }
    //选择兼职类型
    $scope.chooseJobType = function (){
        $ionicActionSheet.show({
            buttons: [
                {text: '家教'},
                {text: '代理'}
            ],
            cancelText: "取消",
            titleText: '请选择',
            cancel: function (){
                return true;
            },
            buttonClicked: function (index){
                //some code at here
                return true
            }
        })
    }
    //选择区域
    $scope.chooseJobTypeArea = function (){
        $ionicActionSheet.show({
            buttons: [
                {text: '张店区'},
                {text: '周村区'}
            ],
            cancelText: "取消",
            titleText: '请选择',
            cancel: function (){
                return true;
            },
            buttonClicked: function (index){
                //some code at here
                return true
            }
        })
    }
    //选择结算方式
    $scope.chooseJobTypeToPay = function (){
        $ionicActionSheet.show({
            buttons: [
                {text: '日结'},
                {text: '周结'},
                {text: '月结'},
                {text: '完工结算'}
            ],
            cancelText: "取消",
            titleText: '请选择',
            cancel: function (){
                return true;
            },
            buttonClicked: function (index){
                switch (index){
                    case 0: $scope.job.typeToPay = "日结"; break;
                    case 1: $scope.job.typeToPay = "周结"; break;
                    case 2: $scope.job.typeToPay = "月结"; break;
                    case 3: $scope.job.typeToPay = "完工结算"; break;
                }
                return true
            }
        })
    }
    //选择工资结算方式
    $scope.chooseJobMoneyAndTime = function (){
        $ionicActionSheet.show({
            buttons: [
                {text: '元/时'},
                {text: '元/天'},
                {text: '元/月'}
            ],
            cancelText: "取消",
            titleText: '请选择',
            cancel: function (){
                return true;
            },
            buttonClicked: function (index){
                switch (index){
                    case 0: $scope.job.moneyAndTime = "元/时"; break;
                    case 1: $scope.job.moneyAndTime = "元/天"; break;
                    case 2: $scope.job.moneyAndTime = "元/月"; break;
                }
                return true
            }
        })
    }
})