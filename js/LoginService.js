angular.module('user.service',[])
.factory('AuthService',function ($http){
	var authService = {};
	var userApi = "http://120.24.218.56/login";
	authService.login = function (data){
		return $http({
				url:userApi,
				method:"POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
	   			},
				data: data
			})
			.then(function (resp){
				console.log(resp.data);
				Session.create(resp.data.id);
				return resp.data.id;
			})
	}

	/*
	authService.isAuthenticated = function (){
		return !!Session.userId;
	}
	authService.isAuthorized = function (authorizedRoles){
		if (!angular.isArray(authorizedRoles)) {
      		authorizedRoles = [authorizedRoles];
    	}
    	return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	}
	*/

	return authService;
})