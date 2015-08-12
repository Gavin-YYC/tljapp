/*
 * create by Gavin
 * 二手模块
 * 页面初始化、分类选择、搜索、查看单个二手详情
 * 加载评论
*/
angular.module('sh.controllers',[])
.controller('ShListController',function ($scope, $http, GetListService){
    //初始化页面数据
    var pageNumber = 0;
    var pageSize = 8;
    var shListApi = "http://120.24.218.56/api/sh/list";
    //接收从子控制器中传来的数据（选择分类等）
    $scope.$on('to-parent', function (event, data){
        if (data == "") {
            $scope.items = data;
            $scope.emptyContent = true;
        }else{
            $scope.items = data;
            $scope.emptyContent = false;
        };
    })
    //页面初始化
    GetListService.getList(shListApi).then(function (data){
        $scope.items = data.data.data.list;
    })
    //页面上拉刷新
    $scope.doRefresh = function (){
        GetListService.getList(shListApi).then(function (data){
            $scope.items = data.data.data.list;
        }).finally(function(){
	        $scope.$broadcast('scroll.refreshComplete');
	    });
    }
    //上拉刷出更多数据
    $scope.loadMore = function (){
    	pageNumber++;
        var api = shListApi+"?pageNumber="+pageNumber+"&pageSize="+pageSize;
        console.log(api);
        // GetListService.getList(api).then(function (data){
        //     $scope.items = data.data.data.list;
        // }).finally(function(){
        //     $scope.$broadcast('scroll.infiniteScrollComplete');
        // });
    }
})

//点击新旧菜单时
.controller('buttonBarController',function ($scope, GetListService){
    $scope.showModal = function (){
        $scope.selecting = !$scope.selecting;
    }
    $scope.ShCommons = ['全新','九成新','八成新','七成新','六成新'];
    $scope.goOldAndNew = function (data){
        var api = "http://120.24.218.56/api/sh/filter?depreciationRate="+data;
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent', data.data.data.list);
        })
        $scope.selecting = !$scope.selecting;
    }
})


//获取二手物品分类列表
.controller('getShCateListCotroller',function ($scope, $state, GetListService){
    var price = ['0-10','10-50','50-100','100-500','1000-5000','>5000'];
    $scope.prices = price;
    var shCateApi = "http://120.24.218.56/api/sh/cate/list";
    GetListService.getList(shCateApi).then(function (data){
        $scope.items = data.data.data.list;
    })
    //按照二手物品分类进行搜索
    $scope.classIdChange = function (value){
        //如果选择了“分类”将不进行操作
        if (value == "") {
            $state.go('shList');
        };
        var api = "http://120.24.218.56/api/sh/category/"+value;
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent',data.data.data.list);
        })
    }
    //根据价格区间进行搜索
    $scope.priceChange = function (value){
        //如果选择了“价格”，则不进行操作
        if (value == "") {
            return false;
        };
        //对选项进行字符串分割
        var dataArr = value.split('-');
        if (dataArr.length == 2) {
            minPrice = dataArr[0];
            maxPrice = dataArr[1];
            var api = "http://120.24.218.56/api/sh/filter?rangeQuery=1&minPrice="+minPrice+"&maxPrice="+maxPrice;
        }
        if (value == ">5000") {
            minPrice = value.substring(1);
            var api = "http://120.24.218.56/api/sh/filter?rangeQuery=1&minPrice="+minPrice;
        }
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent',data.data.data.list);
        })
    }
})

//获取二手物品单个信息详情
.controller('ShDetailController',function ($scope, $ionicHistory, $stateParams, GetListService){
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    var shApi = "http://120.24.218.56/api/sh/"+$stateParams.id;
    var commentApi = "http://120.24.218.56/api/review/job/"+$stateParams.id;
    //加载二手详情
    GetListService.getDetail(shApi).then(function (data){
        var picturePath = data.data.data.picturePath.split(";");
        $scope.pics = picturePath;
        $scope.pics = picturePath;
        $scope.details = data.data.data;
        console.log($scope.details);
    })
    //加载评论
    GetListService.getComment(commentApi).then(function (data){
        $scope.comments = data.data.data.list;
    })
})