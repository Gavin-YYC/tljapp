angular.module('my.controllers',[])
.controller('IndexController',function ($scope,$ionicModal,$ionicHistory){
	
    $ionicModal.fromTemplateUrl('modal-login.html',function(modal){
        $scope.LoginModal = modal;
    },{
        scope: $scope,
        focusFirstInput: true,
        animation: 'slide-in-up'
    });

/*
    $scope.$on('$destroy', function() {
        $scope.LoginModal.remove();
    });
*/

    $ionicModal.fromTemplateUrl('modal-register.html',function(modal){
        $scope.RegisterModal = modal;
    },{
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });
})

//login controller
.controller('LoginController',function ($scope,$http){
    $scope.message = "";
    $scope.user = {
        username:null,
        password:null
    }
    
    $scope.login = function(){
        console.log("login success")
    }
    
})

.controller('MyController',function ($scope,$state) {
	$scope.goToMy = function(){
		$state.go("my");
	}
})