angular.module('user.service',['ngCookies'])
.factory('Auth',function ($cookieStore, ACCESS_LEVELS){
	var _user = $cookieStore.get('user') || "";
	var _token = $cookieStore.get('token') || "";
	var setUser = function (user){
		if (!user.level || user.level < 0) {
			user.level = ACCESS_LEVELS.pub;
		};
		_user = user;
		$cookieStore.put('user', _user);
	};
	var setToken = function (token){
		_token = token;
		$cookieStore.put('token', _token);
	};
	return {
		isAuthorized: function (lvl){
			return _user.level >= lvl;
		},
		isLoggedIn: function (){
			return _user ? true : false;
		},
		getUser: function (){
			return _user;
		},
		getId: function (){
			return _user ? _user.id : null;
		},
		setUser: function (userId){
			setUser(userId);
		},
		setToken: function (tokenObj){
			setToken(tokenObj);
		},
		getUser: function (){
			return _user ? _user : '';
		},
		getToken: function (){
			return _token ? _token : '';
		},
		logout: function (){
			$cookieStore.remove('user');
			$cookieStore.remove('token');
			_user = null;
			_token = null;
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
                d.resolve(data);
            })
            .error(function (data,status){
                d.reject(data);
            })
        return d.promise;
	}
	return authService;
})
.factory('FormatRusult',function($q){
	var formatRusult = {};
	var message = "";
	return {
		format: function (data){
			var d = $q.defer();
			var data = parseFloat(data);
			switch (data){
				case -1: message = "操作失败";d.resolve(message); break;
				case 0: message = "操作成功";d.resolve(message); break;
				case 1: message = "操作过于频繁";d.resolve(message); break;
				case 2: message = "用户名不合法";d.resolve(message); break;
				case 3: message = "密码错误";d.resolve(message); break;
				case 4: message = "用户不存在";d.resolve(message); break;
				case 5: message = "用户已存在";d.resolve(message); break;
				case 6: message = "用户被封号";d.resolve(message); break;
				case 7: message = "你还未登录";d.resolve(message); break;
				case 8: message = "两次输入不一致";d.resolve(message); break;
				case 9: message = "分类不为空";d.resolve(message); break;
				case 10: message = "必填字段为空";d.resolve(message); break;
				case 11: message = "非法参数";d.resolve(message); break;
				case 12: message = "不存在";d.resolve(message); break;
				case 13: message = "权限不足";d.resolve(message); break;
				case 14: message = "不能删除当前用户";d.resolve(message); break;
				case 15: message = "已经存在";d.resolve(message); break;
				case 16: message = "已经喜欢/收藏过了";d.resolve(message); break;
				case 17: message = "非法数字";d.resolve(message); break;
				default: message = "未知原因";d.resolve(message); break;
			}
			return d.promise;
		}
	}
	return formatRusult;
})