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
.controller('LoginController',function ($scope,$rootScope,AuthService){
    $scope.message = "";
    $scope.user = {
        username:null,
        password:null
    }
    $scope.user.rememberMe = true;
    
    $scope.login = function(){
        console.log($scope.user);
        AuthService.login($scope.user)
            .then(function (user){
                console.log(user);
            })
    }
    
})

.controller('MyController',function ($scope,$state) {
	$scope.goToMy = function(){
		$state.go("my");
	}
})