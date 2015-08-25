/*
 * create by Gavin
 * 二手模块
 * 页面初始化、分类选择、搜索、查看单个二手详情
 * 加载评论
*/
angular.module('sh.controllers',['directives.dropdown'])
.controller('ShListController',function ($scope, GetListService, $state){
    $scope.test = function (id){
        window.location = "/#/shdetail/"+id;
        //GetListService.alertTip(id);
    }
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
.controller('buttonBarController',function ($scope, $state, GetListService){
    $scope.selecting = {
        newAndOld:false,
        price:false
    }
    $scope.showModal = function (value){
        if (value == "NewAndOld")
            $scope.selecting.newAndOld = !$scope.selecting.newAndOld;
        if (value == "price") 
            $scope.selecting.price = !$scope.selecting.price;
        if (value == "class") 
            $scope.selecting.class = !$scope.selecting.class;
    }
    $scope.ShCommons = ['全新','九成新','八成新','七成新','六成新'];
    $scope.goOldAndNew = function (data){
        var api = "http://120.24.218.56/api/sh/filter?depreciationRate="+data;
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent', data.data.data.list);
        })
        $scope.selecting.newAndOld = !$scope.selecting.newAndOld;
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
    $scope.goClass = function (value){
        //如果选择了“分类”将不进行操作
        var api = "http://120.24.218.56/api/sh/category/"+value;
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent',data.data.data.list);
            $scope.selecting.class = !$scope.selecting.class;
        })   
    }
    //根据价格区间进行搜索
    $scope.goPrice = function (value){
        //如果选择了“价格”，则不进行操作
        console.log(value);
        if (value == "") $state.go('shList');
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
            $scope.selecting.price = !$scope.selecting.price;
        })
    }
})

//获取二手物品单个信息详情
.controller('ShDetailController',function ($scope, $ionicSlideBoxDelegate, $ionicHistory, $stateParams, GetListService, Auth, FormatRusult){
    //用户后退
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    //获取用户信息
    var user = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    //二手列表以及评论API
    var shApi = "http://120.24.218.56/api/sh/"+$stateParams.id;
    var commentApi = "http://120.24.218.56/api/review/sh/"+$stateParams.id;
    var zanApi = "http://120.24.218.56/user/sh/"+$stateParams.id+"/checklike"+tokenKey;
    //执行是否登录以及赞过检查
    if (user == "" || token == "") {
        $scope.zanColor = "";
    }else{
        GetListService.getList(zanApi).then(function (data){
            if (data.data.message=="true") {
                $scope.zanColor="#F96A39";
            }else{
                $scope.zanColor = "";
            };
            //data.data.result ? $scope.zanColor="#F96A39" : $scope.zanColor = "";
        })
    };
    //用户点赞
    $scope.zan = function (){
        var api = "http://120.24.218.56/user/sh/"+$stateParams.id+"/like"+tokenKey;
        GetListService.userPost(api).then(function (data){
            if (data.message == 16) {
                var api = "http://120.24.218.56/user/sh/"+$stateParams.id+"/unlike"+tokenKey;
                GetListService.userPost(api).then(function (data){
                    if(data.message == 0){
                        $scope.zanColor="";
                        $scope.details.likes -= 1;
                    }
                })
            }else if(data.message == 0){
                $scope.zanColor="#F96A39";
                $scope.details.likes += 1;
            }else{
                FormatRusult.format(data.message).then(function (data){
                    GetListService.alertTip(data);
                })
            }
        })
    }

    //加载二手详情
    GetListService.getDetail(shApi).then(function (data){
        var picturePath = data.data.data.picturePath.split(";");
        $scope.pics = picturePath;
        $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
        $scope.details = data.data.data;
        console.log($scope.details);
    })
    //加载评论
    GetListService.getComment(commentApi).then(function (data){
        $scope.comments = data.data.data.list;
        console.log(commentApi);
    })
})