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
    //展示发布页面
    $scope.postPageShow = false;
    $scope.showSubPage = function (){
        $scope.postPageShow = true;
    }
    $scope.hideSubPage = function(){
        $scope.postPageShow = false;
    }
})

.controller('ChildPageController',function ($scope, $state, Auth){
    //进入分页面
    $scope.myGoTo = function (ChilePage){
        var userId = Auth.getToken()||"";
        if (userId) {
            switch (ChilePage){
                case "myPost":
                    $state.go("myPost");
                break;
                case "myFav":
                    $state.go("myFav");
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
.controller("PostController",function ($scope, $ionicModal, $ionicPopover, $cordovaDatePicker, $ionicSlideBoxDelegate, GetListService){
    //初始化表单数据
    $scope.job = {
        typeToPay:"日结",
        typeArea:"张店区",
        type:"家教",
        moneyAndTime: "元/时",
        title:'',
        wage:"",
        enddate:'',
        time:"",
        place:"",
        content:"",
        require:"",
        name:"",
        phoneNumber:"",
        QQ:""
    };
    //modal初始化
    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //modal初始化
    $ionicModal.fromTemplateUrl('my-modal-content.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //Popover初始化
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    //点击下一步与上一步
    $scope.goNext = function(index){
        $ionicSlideBoxDelegate.next();
        console.log($scope.job)
    }
    $scope.goPrevious = function(index){
        $ionicSlideBoxDelegate.previous();
    }
    //选择兼职类型
    $scope.chooseJobType = function (){
        $scope.value = "class"; //初始化modal分类
        $scope.modal.show();    //显示modal
        var categoryApi = "http://120.24.218.56/api/job/cate/list";
        GetListService.getList(categoryApi).then(function (data){
            $scope.items = data.data.data.list;
        })
    }
    //选择区域，解释同上
    $scope.chooseJobTypeArea = function (){
        $scope.value = "area";
        $scope.modal.show();
        $scope.items = [
            {name:"张店区"},
            {name:"周村区"},
            {name:"淄川区"},
            {name:"临淄区"},
            {name:"博山区"},
            {name:"桓台区"},
            {name:"高青区"},
            {name:"沂源县"}
        ]
    }
    //同步input表单数据
    $scope.select = function (type,value){
        switch (type){
            case "class":
                $scope.job.type = value;
            break;
            case "area":
                $scope.job.typeArea = value;
            break;
            case "pay":
                $scope.job.typeToPay = value;
            break;
            case "day":
                $scope.job.moneyAndTime = value;
            break;
        }
        $scope.modal.hide();
        $scope.popover.hide();
    }
    //选择结算方式
    $scope.chooseJobTypeToPay = function ($event){
        $scope.popover.show($event);
        $scope.value = "pay";
        $scope.items = ["日结","周结","月结","完工结算"];
    }
    //选择工资结算方式
    $scope.chooseJobMoneyAndTime = function ($event){
        $scope.popover.show($event);
        $scope.value = "day";
        $scope.items = ["元/时","元/天","元/月"];
    }
    $scope.chooseTime = function (){
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(date){
            $scope.job.enddate = date;
        });
    }
    //选项切换
    $scope.show = true;
    $scope.tonggle = function (){
        $scope.show = !$scope.show;
    }
    //确定输入
    $scope.re = {
        content: "",
        title:""
    }
    //进入内容填写页面
    $scope.chooseContent = function (value){
        switch (value){
            case "time":
                $scope.re.title = "工作时间";
            break;
            case "place":
                $scope.re.title = "工作地点";
            break;
            case "content":
                $scope.re.title = "工作内容";
            break;
            case "require":
                $scope.re.title = "工作要求";
            break;
        }
        $scope.modal.show();
        $scope.value = value;
    }
    $scope.hideModal = function(value){

        console.log($scope.re.content);
        $scope.job[value] = $scope.re.content;
        $scope.modal.hide();
        $scope.re.content = "";
    }
    //发布信息按钮
    $scope.goPost = function (isValid){
        console.log(isValid);
    }
})

//我的发布页面
.controller("MyPostController", function ($scope, $ionicSlideBoxDelegate, Auth, GetListService){
    //slide-tab跳转颜色转换
    $scope.index = 0;
    $scope.go = function (index){
        $scope.index = index;
        $ionicSlideBoxDelegate.slide(index);
    }
    //加载数据并初始化
    var username = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    var myJobApi = "http://120.24.218.56/api/job/user/"+username+tokenKey;
    var myShApi = "http://120.24.218.56/api/sh/user/"+username+tokenKey+"&filter=false";
    //加载我收藏的兼职信息
    GetListService.getList(myJobApi).then(function (data){
        $scope.jobItems = data.data.data.list;
        var length = data.data.data.list.length;
        var resultCount = data.data.data.resultCount;
        $scope.jobEmptyContent = checkMore(length,resultCount);
        $scope.jobCount = resultCount;
    })
    //加载我收藏的二手物品
    GetListService.getList(myShApi).then(function (data){
        $scope.shItems = data.data.data.list;
        var length = data.data.data.list.length;
        var resultCount = data.data.data.resultCount;
        $scope.emptyContent = checkMore(length,resultCount);
        $scope.shCount = resultCount;
    })
    //检查是否能加载更多
    function checkMore(length, resultCount){
        if (length == 8 && resultCount >=8) {
            return false;
        }else{
            return true;
        };
    }
    //加载更多
    //初始化分页参数
    var pageNumber = 0;
    var pageSize = 8;
    $scope.loadMore = function(index){
        pageNumber++;
        var pageKey = "pageNumber="+pageNumber+"&pageSize="+pageSize;
        //加载转换
        switch (index){
            case "job":
                var api = myJobApi;
                var items = "jobItems";
                var pageKey = "?"+pageKey;
            break;
            case "sh":
                var api = myShApi;
                var items = "shItems";
                var pageKey = "&"+pageKey;
            break;
        }
        console.log(pageKey)
        //发起请求 
        GetListService.getList(api+pageKey).then(function (data){
            $scope[items] = $scope[items].concat(data.data.data.list);
            var length = data.data.data.list.length;
            var resultCount = data.data.data.resultCount;
            $scope.emptyContent = checkMore(length,resultCount);
        })
    }
})
.controller('MyFavController', function ($scope){
    //slide-tab跳转颜色转换
    $scope.index = 0;
    $scope.go = function (index){
        $scope.index = index;
        $ionicSlideBoxDelegate.slide(index);
    }
})