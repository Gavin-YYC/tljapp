angular.module('getlist.service',[])
.factory('GetListService',function ($http){
	var getListService = {};
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
	getListService.getDetail = function (api){
	    return  $http.get(api)
	        .success(function(newItems){
	            if (newItems.ok == true) {
	                return newItems.data;
	            };
	        })
	}
	getListService.getComment = function (api){
	    return  $http.get(api)
	        .success(function(newItems){
	            if (newItems.ok == true) {
	                return newItems.data;
	            };
	        })
	}
	return getListService;
})