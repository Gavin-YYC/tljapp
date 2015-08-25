/*
 *统一请求服务
 *获取二级目录、三级详情、评论等接口的统一服务
 *只传入一个api即可
*/
angular.module('getlist.service',['ngCookies'])
.factory('GetListService',function ($q,$http,$ionicPopup,$cookies){
	var getListService = {};
	//获取二级列表
	getListService.getList = function (api){
	    return $http.get(api)
	        .success(function(newItems) {
	            if (newItems.ok == true) {
	                return newItems.data;
	            }else{
	                //else code
	            };
	        })
	}
	//获取单个信息详情
	getListService.getDetail = function (api){
	    return $http.get(api)
	        .success(function(newItems){
	            if (newItems.ok == true) {
	                return newItems.data;
	            };
	        })
	}
	//获取单个信息评论
	getListService.getComment = function (api){
	    return $http.get(api)
	        .success(function(newItems){
	            if (newItems.ok == true) {
	                return newItems.data;
	            };
	        })
	}

	//意见反馈
	getListService.addFeedback = function(api,data){
		var d = $q.defer();
		$http({
                url:api,
                method:"POST",
                headers:{
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

	getListService.userPost = function (api, data){
		var d = $q.defer();
		$http({
            url:api,
            method:"POST",
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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

	//通用弹出提示
	getListService.alertTip = function (data){
		return $ionicPopup.alert({
                    title: '友情提示：',
                    template: data
            });
	}
	return getListService;
})