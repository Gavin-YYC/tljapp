angular.module('user.service',['ngCookies'])
.factory('Auth',function ($cookieStore, ACCESS_LEVELS){
	var _user = $cookieStore.get('user') || "";
	var setUser = function (user){
		if (!user.level || user.level < 0) {
			user.level = ACCESS_LEVELS.pub;
		};
		_user = user;
		$cookieStore.put('user',_user);
	};
	return {
		isAuthorized: function (lvl){
			return _user.level >= lvl;
		},
		setUser: setUser,
		isLoggedIn: function (){
			return _user ? true : false;
		},
		getUser: function (){
			return _user;
		},
		getId: function (){
			return _user ? _user.id : null;
		},
		setToken: function (tokenObj){
			setUser(tokenObj);
		},
		getToken: function (){
			return _user ? _user : '';
		},
		logout: function (){
			$cookieStore.remove('user');
			_user = null;
			console.log(_user);
		}
	}
})
.factory('Login',function ($q, $http){
	var authService = {};
	authService.new = function (data,url){
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
                d.reject(data);
            })
        return d.promise;
	}
	return authService;
})