/*
 * create by Gavin
 * 二手模块
 * 页面初始化、分类选择、搜索、查看单个二手详情
 * 加载评论
*/
angular.module('sh.controllers',['directives.dropdown'])
.controller('ShListController',function ($scope, GetListService, $state, $rootScope, $timeout){
    $scope.test = function (id){
        window.location = "/#/shdetail/"+id;
    }
    //初始化页面数据
    var pageNumber = 0;
    var pageSize = 8;
    var shListApi = "http://120.24.218.56/api/sh/list";
    //接收从子控制器中传来的数据（选择分类等）
    $scope.$on('to-parent', function (event, data){
        //配置全局搜索Api
        $scope.loadMoreApi = data.api;
        if (data == "") {
            $scope.items = data.list;
            $scope.emptyContent = true;
        }else{
            $scope.items = data.list;
            $scope.emptyContent = false;
        };
        checkNext(data.list.length);
    })
    //页面初始化
    GetListService.getList(shListApi).then(function (data){
        $scope.items = data.data.data.list;
        checkNext(data.data.data.list.length);
    })
    //页面下拉刷新
    $scope.doRefresh = function (){
        //如果有搜索Api，则刷新搜索页面，否则为普通列表
        var api = $scope.loadMoreApi ? $scope.loadMoreApi : shListApi;
        console.log(api);
        GetListService.getList(api).then(function (data){
            $scope.items = data.data.data.list;
            checkNext(data.data.data.list.length);
        }).finally(function(){
	        $scope.$broadcast('scroll.refreshComplete');
	    });
    }
    //上拉刷出更多数据
    $scope.loadMore = function (){
    	pageNumber++;
        var pageKey = "?pageNumber="+pageNumber+"&pageSize="+pageSize;
        var api = $scope.loadMoreApi ? $scope.loadMoreApi+pageKey : shListApi+pageKey;
        console.log(api);
        $rootScope.loading = true;
        GetListService.getList(api).then(function (data){
            $timeout(function(){
                $scope.items = $scope.items.concat(data.data.data.list);
                $rootScope.loading = false;
            },1000);
            checkNext(data.data.data.list.length);
        })
    }
    //如果列表结果小于8，则加载下一页
    function checkNext(resultCount){
        if (resultCount == 8) {
            $scope.emptyContent = false;
        }else{
            $scope.emptyContent = true;
        }
    }
})

//点击新旧菜单时
.controller('buttonBarController',function ($scope, $state, GetListService){
    $scope.selecting = {
        newAndOld:false,
        price:false
    }
    $scope.showCateMore = {
        class:false,
        NewAndOld:false,
        price:false
    }
    //显示二级选项菜单
    $scope.showModal = function (value){
        $scope.selecting[value] = !$scope.selecting[value];
        for (var i = 0; i < $scope.selecting.length; i++) {
            console.log($scope.selecting[i]);
            console.log("dsa")
        };
        $scope.showCateMore[value] = !$scope.showCateMore[value];
    }
    $scope.ShCommons = ['全新','九成新','八成新','七成新','六成新'];
    $scope.goOldAndNew = function (data){
        var api = "http://120.24.218.56/api/sh/filter?depreciationRate="+data;
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent', data.data.data);
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
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.class = !$scope.selecting.class;
        })   
    }
    //根据价格区间进行搜索
    $scope.goPrice = function (value){
        //如果选择了“价格”，则不进行操作
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
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.price = !$scope.selecting.price;
        })
    }
})

//获取二手物品单个信息详情
.controller('ShDetailController',function ($scope, $ionicSlideBoxDelegate, $ionicActionSheet, $ionicHistory, $stateParams, GetListService, Auth, FormatRusult){
    //用户后退
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    //获取用户信息
    var user = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    var baseUrl = "http://120.24.218.56";
    //二手列表以及评论API
    var shApi = baseUrl+"/api/sh/"+$stateParams.id;
    var commentApi = baseUrl+"/api/review/sh/"+$stateParams.id;
    var zanApi = baseUrl+"/user/sh/"+$stateParams.id+"/checklike"+tokenKey;
    var subCommentApi = baseUrl+"/user/sh/"+$stateParams.id+"/review/post"+tokenKey;
    var colApi = "http://120.24.218.56/api/u/sh/fav/"+user+tokenKey;
    //执行是否登录以及赞过检查
    if (user == "" || token == "") {
        $scope.zanColor = "";
        $scope.inUser = {
            profilePhotoId: "",
            username: ""
        };
    }else{
        //获取用户信息
        var userApi = baseUrl+"/api/user/"+user+tokenKey;
        GetListService.getList(userApi).then(function(data){
            console.log(data)
            $scope.inUser = data.data.data;
        })
        //用户是否点赞
        GetListService.getList(zanApi).then(function (data){
            if (data.data.message=="true") {
                $scope.zanColor="#F96A39";
            }else{
                $scope.zanColor = "";
            };
        })
        //用户时候收藏
        GetListService.getList(colApi).then(function (data){
            if (data.data.data==true) {
                $scope.colColor="#F96A39";
            }else{
                $scope.colColor = "";
            };
        })
    };
    //用户点赞
    $scope.zan = function (){
        var api = baseUrl+"/user/sh/"+$stateParams.id+"/like"+tokenKey;
        GetListService.userPost(api).then(function (data){
            if (data.message == 16) {
                var api = baseUrl+"/user/sh/"+$stateParams.id+"/unlike"+tokenKey;
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
    //用户收藏
    $scope.col = function (){
        var api = baseUrl+"/user/job/fav/"+user+tokenKey;
        GetListService.userPost(api).then(function (data){
            console.log(data);
            if (data.hasOwnProperty("parm")) {
                if (data.parm.status == 1) $scope.colColor="";
                if (data.parm.status == 0) $scope.colColor="#F96A39";
            }else{
                if (data.message == 16) {
                    $scope.colColor="";
                }else if(data.message == 0){
                    $scope.colColor="#F96A39";
                }else{
                    FormatRusult.format(data.message).then(function (data){
                        GetListService.alertTip(data);
                    })
                } 
            }
        })
    }
    //显示更多
    $scope.jobDetailMore = function (){
        $ionicActionSheet.show({
             buttons: [
               { text: '举报' },
               { text: '合作热线' },
               { text: '意见反馈' }
             ],
             titleText: '请选择',
             cancelText: '取消',
             cancel: function() {
                  // add cancel code..
                },
             buttonClicked: function(index) {
                //执行删除操作
                
                return true;
             }
        });
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
        //加载对应的回复评论
        // for (var i = 0; i < $scope.comments.length; i++) {
        //     var api = baseUrl +　"/api/review/reply?reviewId="+$scope.comments[i].id;
        //     GetListService.getList(api).then(function (data){
        //         $scope.subComments = data.data.data.list
        //     })
        // }
        $scope.commentsCount = data.data.data.resultCount;
        if ($scope.commentsCount >= 8) {
            $scope.emptyContent = true;
        }
    })
    //加载更多评论
    $scope.loadMoreCom = function (){
        pageNumber++;
        var pageKey = "?pageNumber="+pageNumber+"&pageSize="+pageSize;
        var api = baseUrl+"/api/review/sh/"+userId+pageKey;
        GetListService.getList(api).then(function (data){
            if (data.data.data.list.length == 8) {
                $scope.comments = $scope.comments.concat(data.data.data.list);
            }else{
                $scope.comments = $scope.comments.concat(data.data.data.list);
                $scope.emptyContent = false;
            }
        })
    }
    //评论页和底部菜单切换
    $scope.commentClick = true;
    //提交评论
    $scope.vm = {
        commentData:"",
        placeholder:"输入评论内容",
        isReplyToOne:"1"
    };
    //切换到普通评论
    $scope.toComment = function (){
        $scope.commentClick = !$scope.commentClick;
        $scope.vm.commentData = "";
        $scope.vm.placeholder = "输入评论内容";
        $scope.vm.isReplyToOne = "replyToPost";
    }
    //点击评论某条评论
    $scope.reply = function (toUsername,commentId){
        if ($scope.commentClick) {
            $scope.commentClick = !$scope.commentClick;
        }
        $scope.vm.commentData = "";
        $scope.vm.placeholder="回复："+toUsername;
        $scope.vm.isReplyToOne = "replyToOne";
        $scope.commentId = commentId;
    }
    $scope.sendComment = function (isReplyToOne){
        var commentData = $scope.vm.commentData;
        var data = "content="+commentData;
        if (isReplyToOne == "replyToOne") {
            api = baseUrl+"/api/review/u/reply"+tokenKey;
            data = "repliedReviewId="+$scope.commentId+"&memberId="+user+"&content="+commentData;
        }else{
            api = subCommentApi;
            data = data;
        }
        if (commentData == ""||commentData == null) {
            GetListService.alertTip("评论内容不能为空！");
            return false;
        };
        //模仿一个数据进行更新
        var jsonData = {
            member: {
                profilePhotoId: $scope.inUser.profilePhotoId,
                username: $scope.inUser.username
            },
            content:commentData,
            time:(new Date()).valueOf()
        }
        //提交评论
        GetListService.userPost(api,data).then(function (data){
            console.log(data);
            if (data.message == 0 || data.result == true) {
                $scope.comments.unshift(jsonData);
                $scope.vm.commentData = "";
            }else{
                FormatRusult.format(data.message).then(function (data){
                    GetListService.alertTip(data);
                })
            }
        })
    }
})