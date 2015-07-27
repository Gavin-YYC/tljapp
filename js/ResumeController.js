angular.module('resume.controllers',[])
.controller('ResumeListController',function ($scope,$http){

})

.controller('ResumeDetailController',function ($scope,$http,$stateParams,$ionicHistory){
	var id = $stateParams.id;
	console.log(id);
	$scope.myGoBack = function (){
		$ionicHistory.goBack();
	}
})