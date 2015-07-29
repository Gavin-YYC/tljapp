angular.module('my.controllers',[])
.controller('IndexController',function ($scope,$ionicModal,$ionicHistory){
	
    $ionicModal.fromTemplateUrl('modal-login.html',function(modal){
        $scope.LoginModal = modal;
    },{
        scope: $scope,
        focusFirstInput: true,
        animation: 'slide-in-up'
    });


    $ionicModal.fromTemplateUrl('modal-register.html',function(modal){
        $scope.RegisterModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });
})

//login controller
.controller('LoginController',function ($scope,AuthService,GetListService){
    $scope.message = "";
    $scope.user = {
        username:null,
        password:null
    }
    $scope.user.rememberMe = true;
    var userApi = "http://120.24.218.56/login";
    $scope.login = function(){
        var subdata = "username="+$scope.user.username+"&password="+$scope.user.password+"&rememberMe="+$scope.user.rememberMe;
        AuthService.login(subdata,userApi)
            .then(function (data){
                if (!data.data.result) {
                    GetListService.alertTip(data.data.message);
                }else{
                    GetListService.alertTip("登录成功！");
                };
            },function (data){
                console.log(data);
            })
    }
    
})

.controller('MyController',function ($scope,$state,$ionicModal) {
	$scope.goToMy = function(){
		$state.go("my");
	}
    $ionicModal.fromTemplateUrl('feedback.html',function(modal){
        $scope.FeedbackModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up'
    });
})

//投稿反馈
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

