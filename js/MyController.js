/*
 *  my.controllers
 *  Children Controlles Followed：
 *    --IndexController    （主页控制器）
 *    --LoginController    （登录控制器）
 *    --RegisterController （注册控制器）
 *    --MyController       （个人中心控制器）
 *    --ChildPageController（个人中心进入各分页面路口）
 *    --FeedbackController （意见反馈中心控制器）
 *    --LogoutController   （注销控制器）
 *    --PostController     （发布兼职信息）
 *    --MyPostController   （我的发布）
 *    --MyFavController    （我的收藏）
 *    --ChangePwdController（修改密码）
*/
angular.module('my.controllers',['ngCordova','my_2.controllers'])
//个人中心控制器
.controller('IndexController',function ($scope, $ionicModal, $ionicHistory, $state, Auth, GetListService){
    //进入个人中心
    $scope.goToMy = function(){
        $state.go("my",{},{reload: true});
    }
    //展示发布页面
    $scope.postPageShow = false;
    $scope.showSubPage = function (){
        $scope.postPageShow = true;
    }
    $scope.hideSubPage = function(){
        $scope.postPageShow = false;
    }
    $scope.goToPost = function (value){
        var userId = Auth.getUser() || "";
        var token = Auth.getToken() || "";
        if (userId == "" || token == "") {
            GetListService.alertTip("你还没有登录！");
        }else{
            $state.go("post");
            $scope.postPageShow = false;
        }
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
    var token = Auth.getToken() || "";
    var tokenKey = "&appToken="+token;
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
    //显示有多少未读消息
    $scope.unReadMessage = 0;
    var unReadApi = "http://120.24.218.56/api/noti/pri/unread?memberId="+userId+tokenKey;
    GetListService.getList(unReadApi).then(function (data){
        $scope.unReadMessage = data.data.data.resultCount;
    })
    //弹出投稿反馈模态框
    $ionicModal.fromTemplateUrl('feedback.html',function(modal){
        $scope.FeedbackModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    })
    //弹出修改密码模态框
    $ionicModal.fromTemplateUrl('modal-changePwd.html',function(modal){
        $scope.ChangePwd = modal;
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

//进入二级菜单路口
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
                case "myMessage":
                    $state.go("myMessage");
                break;
                case "myPwd":
                    $scope.ChangePwd.show();
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
.controller('FeedbackController',function ($scope,$http,GetListService){
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

    $scope.images_list = [];

    // "添加附件"Event
    $scope.addAttachment = function() {
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
    $scope.me = {
        success:"",
        err:"",
        progress:""
    }
    $scope.takePhoto = function () {
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth: 600,
            targetHeight: 800
        };
        $cordovaCamera.getPicture(options).then(function (imageURI) {
            var fileName = imageURI.split("/").pop();
            $scope.me.success = imageURI + "<br>"+fileName;
            var options = {
                fileKey: "headImgUrl",
                fileName: fileName,
                mimeType: "image/jpg",
                params: {}
            };
            var uploadApi = "http://120.24.218.56/static/upload";
            $cordovaFileTransfer.upload(uploadApi, imageURI, options)
                .then(function(result) {
                    $scope.me.success = result;
                }, function(err) {
                    $scope.me.err = err;
                }, function (progress) {
                    $scope.me.progress = progress;
                })
                $scope.me.success = "\n在这里\n";
        }, function (err) {
            $scope.me.success = "\n这里是错误"+err;
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
})

//发布兼职信息
.controller("PostController",function ($scope, $ionicModal, $ionicActionSheet, Auth, $cordovaDatePicker, $ionicSlideBoxDelegate, GetListService){
    //初始化表单数据
    var username = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    $scope.job = {
        typeToPay:"日结",
        typeArea:"张店区",
        type:"家教",
        moneyAndTime: "元/时",
        title:'',
        wage:"",
        enddate:"",
        time:"",
        place:"",
        content:"",
        require:"",
        name:"",
        phoneNumber:"",
        QQ:"",
        cateType:1
    };
    //选择工作区域和工作类型模态框
    $ionicModal.fromTemplateUrl('my-modal-select.html',function(modal){
        $scope.SelectModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    })
    //工作具体内容模态框
    $ionicModal.fromTemplateUrl('my-modal-content.html',function(modal){
        $scope.ContentModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    })
    //点击下一步与上一步
    $scope.goNext = function(index){
        $ionicSlideBoxDelegate.next();
    }
    $scope.goPrevious = function(index){
        $ionicSlideBoxDelegate.previous();
    }
    //选择兼职类型
    $scope.selectType = false;
    $scope.chooseJobType = function (){
        $scope.value = "class"; //初始化modal分类
        $scope.SelectModal.show();    //显示modal
        var categoryApi = "http://120.24.218.56/api/job/cate/list";
        GetListService.getList(categoryApi).then(function (data){
            $scope.items = data.data.data.list;
            $scope.selectType = true;
        })
    }
    //选择区域，解释同上
    $scope.chooseJobTypeArea = function (){
        $scope.value = "area";
        $scope.SelectModal.show(); 
        $scope.items = [
            {name:"张店区"},
            {name:"周村区"},
            {name:"淄川区"},
            {name:"临淄区"},
            {name:"博山区"},
            {name:"桓台区"},
            {name:"高青区"},
            {name:"沂源县"}
        ];
        $scope.selectType = false;
    }
    //同步input表单数据
    $scope.select = function (type,value,id){
        switch (type){
            case "class":
                $scope.job.type = value;
                $scope.job.cateType = id;
                console.log($scope.job.cateType);
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
        $scope.ContentModal.hide();
        $scope.SelectModal.hide();
    }
    //选择结算方式
    $scope.chooseJobTypeToPay = function (){
        $scope.value = "pay";
        $ionicActionSheet.show({
            buttons: [{ text:'日结'},{text:'周结'},{text:'月结'},{text:'完工结算'}],
            cancelText: '取消',
            cancel: function() {
                return true;
            },
            buttonClicked: function(index) {
                $scope.job.typeToPay = select(index);
                function select (index) {
                    switch (index){
                        case 0: return "日结";break;
                        case 1: return "周结";break;
                        case 2: return "月结";break;
                        case 3: return "完工结算";break;
                        default:break;
                    }
                }
                return true;
            }
        });
    }
    //选择工资结算方式
    $scope.chooseJobMoneyAndTime = function ($event){
        $scope.value = "day";
        $ionicActionSheet.show({
            buttons: [{ text:'元/时'},{text:'元/天'},{text:'元/月'}],
            cancelText: '取消',
            cancel: function() {
                return true;
            },
            buttonClicked: function(index) {
                $scope.job.moneyAndTime = select(index);
                function select (index) {
                    switch (index){
                        case 0: return "元/时";break;
                        case 1: return "元/天";break;
                        case 2: return "元/月";break;
                        default:break;
                    }
                }
                return true;
            }
        });
    }
    $scope.chooseTime = function (){
        var options = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            is24Hour: true,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000',
            androidTheme:'THEME_DEVICE_DEFAULT_LIGHT'
        };
        $cordovaDatePicker.show(options).then(function(date){
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            /*
            var hours = data.getHours();
            var minites = data.getMinutes();
            var second = data.getSeconds();
            var last = " "+hours+":"+minites+":"+second;
            */
            var first = year+"-"+month+"-"+day;
            $scope.job.enddate = first;
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
                $scope.re.content = $scope.job.time;
            break;
            case "place":
                $scope.re.title = "工作地点";
                $scope.re.content = $scope.job.place;
            break;
            case "content":
                $scope.re.title = "工作内容";
                $scope.re.content = $scope.job.content;
            break;
            case "require":
                $scope.re.title = "工作要求";
                $scope.re.content = $scope.job.require;
            break;
        }
        $scope.ContentModal.show();
        $scope.value = value;
    }
    $scope.hideModal = function(value){
        console.log($scope.re.content);
        $scope.job[value] = $scope.re.content;
        $scope.ContentModal.hide();
        $scope.re.content = "";
    }
    //发布信息按钮
    $scope.goPost = function (isValid){
        if (isValid.$valid) {
            var api = "http://120.24.218.56/user/job/post"+tokenKey;
            console.log(api)
            var data = "title="+$scope.job.title+
                       "&jobPostCategoryId="+$scope.job.cateType+
                       "&expiredTime="+$scope.job.enddate+
                       "&wage="+$scope.job.wage+
                       "&salaryUnit="+$scope.job.moneyAndTime.split("/")[1]+
                       "&timeToPay="+$scope.job.typeToPay+
                       "&workTime="+$scope.job.time+
                       "&workPlace="+$scope.job.place+
                       "&jobDetail="+$scope.job.content+
                       "&jobDescription="+$scope.job.require+
                       "&contact="+$scope.job.name+
                       "&contactPhone="+$scope.job.phoneNumber+
                       "&contactQq="+$scope.job.QQ+
                       "&region="+$scope.job.typeArea;
            GetListService.userPost(api, data).then(function (data){
                if(data.message == 0){
                    GetListService.alertTip("发布成功");
                //其他情况，输出错误提示
                }else{
                    FormatRusult.format(data.message).then(function (data){
                        GetListService.alertTip(data);
                    })
                }
            })
        }else{
            $scope.hasErrBox = true;
        }
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
    //加载我发布的兼职信息
    GetListService.getList(myJobApi).then(function (data){
        $scope.jobItems = data.data.data.list;
        var length = data.data.data.list.length;
        var resultCount = data.data.data.resultCount;
        $scope.jobEmptyContent = GetListService.hasNextPage(length,resultCount);
        $scope.jobCount = resultCount;
    })
    //加载我发布的二手物品
    GetListService.getList(myShApi).then(function (data){
        $scope.shItems = data.data.data.list;
        var length = data.data.data.list.length;
        var resultCount = data.data.data.resultCount;
        $scope.emptyContent = GetListService.hasNextPage(length,resultCount);
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
.controller('MyFavController', function ($scope, GetListService, Auth, $ionicSlideBoxDelegate){
    //slide-tab跳转颜色转换
    $scope.index = 0;
    $scope.go = function (index){
        $scope.index = index;
        $ionicSlideBoxDelegate.slide(index);
    }
    var username = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    var myJobFavApi = "http://120.24.218.56/api/u/job/favlist"+tokenKey;
    var myShFavApi = "http://120.24.218.56/api/u/sh/favlist"+tokenKey;
    //加载我收藏的兼职信息
    GetListService.getList(myJobFavApi).then(function (data){
        $scope.jobItems = data.data.data.list;
        var length = data.data.data.list.length;
        var resultCount = data.data.data.resultCount;
        $scope.jobEmptyContent = GetListService.hasNextPage(length,resultCount);
        $scope.jobCount = resultCount;
    })
    //加载我收藏的二手物品
    GetListService.getList(myShFavApi).then(function (data){
        $scope.shItems = data.data.data.list;
        var length = data.data.data.list.length;
        var resultCount = data.data.data.resultCount;
        $scope.emptyContent = GetListService.hasNextPage(length,resultCount);
        $scope.shCount = resultCount;
    })
    //加载更多
    //初始化分页参数
    var pageNumber = 0;
    var pageSize = 8;
    $scope.loadMore = function(index){
        pageNumber++;
        var pageKey = "?pageNumber="+pageNumber+"&pageSize="+pageSize;
        //加载转换
        switch (index){
            case "job":
                var api = myJobFavApi;
                var items = "jobItems";
            break;
            case "sh":
                var api = myShFavApi;
                var items = "shItems";
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
.controller("ChangePwdController", function ($scope, $ionicModal, $timeout, GetListService, Auth, FormatRusult){
    var username = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    var api = "http://120.24.218.56/user/setting/security"+tokenKey;
    $scope.modify = {
        oldPwd: "",
        newPwd: "",
        reNewPwd: ""
    }
    $scope.haserr = false;
    $scope.err = {message:""};
    $scope.subPwd = function (){
        if ($scope.modify.oldPwd.length < 6||$scope.modify.newPwd.length < 6||$scope.modify.reNewPwd.length < 6) {
            $scope.haserr = true;
            var errs = "密码长度最少为六位！";
        }else if ($scope.modify.newPwd != $scope.modify.reNewPwd) {
            $scope.haserr = true;
            var errs = "两次密码不一样！";
        }else{
            var data = "oldPassword="+$scope.modify.oldPwd+"&newPassword="+$scope.modify.newPwd+"&rePassword="+$scope.modify.reNewPwd;
            GetListService.userPost(api,data).then(function (data){
                if (data.message == "0") {
                    var errs = "密码修改成功！";
                    $scope.haserr = true;
                    $scope.err.message = errs;
                    $timeout(function(){
                        $scope.ChangePwd.hide();
                    },1500);
                }else if (data.message == "3"){
                    $scope.haserr = true;
                    var errs = "旧密码错误!";
                    $scope.err.message = errs;
                }else{
                    FormatRusult.format(data.message).then(function (data){
                        $scope.haserr = true;
                        var errs = data;
                        $scope.err.message = errs;
                    })
                }
            })
        }
        $scope.err.message = errs;
    }
})
