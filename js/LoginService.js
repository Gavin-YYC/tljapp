angular.module('user.service',[])
.factory('AuthService',function ($q,$http){
	var authService = {};
	authService.login = function (data,url){
		var d = $q.defer();
		return $http({
				url:url,
				method:"POST",
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
	   			},
				data: data
			})
            .success(function (data,status){
            	console.log(data);
                d.resolve(data);
            })
            .error(function (data,status){
            	console.log(data);
                d.reject(data);
            })
        return d.promise;
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