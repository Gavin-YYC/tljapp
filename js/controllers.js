/* 兼职页面控制器 */
angular.module('starter.controllers',['my.controllers','directives.dropdown'])
.controller('ListController',function ($scope, GetListService){
    //初始化 请求页面参数
    var pageBase = 0;
    var pageSize = 8;
    var listApi = "http://120.24.218.56/api/job/list";
    //接收来自子控制器的消息
    $scope.$on('to-parent',function (event,data){
        //配置全局搜索Api
        $scope.loadMoreApi = data.api;
        //页面更新数据
        if (data.list == "") {
            $scope.items = data.list;
            $scope.emptyContent = true;
        }else{
            $scope.items = data.list;
            $scope.emptyContent = false;
        };
        checkNext(data.list.length);
    })
    //加载兼职首页的数据
    GetListService.getList(listApi).then(function (data){
        $scope.items = data.data.data.list;
        checkNext(data.data.data.list.length);
    })
    //下拉更新操作，数据更新，并进行提示
    $scope.doRefresh = function(){
        //如果有搜索Api，则刷新搜索页面，否则为普通列表
        var api = $scope.loadMoreApi ? $scope.loadMoreApi : listApi;
        GetListService.getList(api).then(function (data){
            $scope.items = data.data.data.list;
            checkNext(data.data.data.list.length);
        }).finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
        });
    }
    //加载更多
    $scope.loadMore = function (){
        pageBase++;
        var pageKey = "?pageNumber="+pageBase+"&pageSize="+pageSize;
        var api = $scope.loadMoreApi ? $scope.loadMoreApi+pageKey : listApi+pageKey;
        console.log(api);
        GetListService.getList(api).then(function (data){
            $scope.items = $scope.items.concat(data.data.data.list);
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

/* 兼职详情页，加载内容的同时加载评论 */
.controller('DetailController',function ($scope, $ionicActionSheet, $http, $stateParams, $ionicHistory, GetListService, Auth, FormatRusult){
    $scope.myGoBack = function (){
        $ionicHistory.goBack();
    }
    //获取用户信息
    var user = Auth.getUser() || "";
    var token = Auth.getToken() || "";
    var tokenKey = "?appToken="+token;
    //初始化分页
    var pageNumber = 0;
    var pageSize = 8;
    var pageKey = "?pageNumber="+pageNumber+"&pageSize="+pageSize;
    //初始化API
    var userId = $stateParams.id;
    var jobApi = "http://120.24.218.56/api/job/"+userId;
    var commentApi = "http://120.24.218.56/api/review/job/"+userId+pageKey;
    var subCommentApi = "http://120.24.218.56/user/job/"+userId+"/review/post"+tokenKey;
    var zanApi = "http://120.24.218.56/user/job/"+userId+"/checklike"+tokenKey;
    var colApi = "http://120.24.218.56/api/u/job/fav/"+userId+tokenKey;
    //执行是否登录以及赞过检查
    if (user == "" || token == "") {
        $scope.zanColor = "";
        $scope.inUser = {
            profilePhotoId: "",
            username: ""
        };
    }else{
        //获取用户信息
        var userApi = "http://120.24.218.56/api/user/"+user;
        GetListService.getList(userApi).then(function(data){
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
        var api = "http://120.24.218.56/user/job/"+userId+"/like"+tokenKey;
        GetListService.userPost(api).then(function (data){
            //如果已经点过赞了，则取消点赞、颜色消失、数字减一
            if (data.message == 16) {
                var api = "http://120.24.218.56/user/job/"+userId+"/unlike"+tokenKey;
                GetListService.userPost(api).then(function (data){
                    if(data.message == 0){
                        $scope.zanColor="";
                        $scope.item.likes -= 1;
                    }
                })
            //如果没有点过赞，则颜色、数字加一
            }else if(data.message == 0){
                $scope.zanColor="#F96A39";
                $scope.item.likes += 1;
            //其他情况，输出错误提示
            }else{
                FormatRusult.format(data.message).then(function (data){
                    GetListService.alertTip(data);
                })
            }
        })
    }
    //用户收藏
    $scope.col = function (){
        var api = "http://120.24.218.56/user/job/fav/"+userId+tokenKey;
        GetListService.userPost(api).then(function (data){
            if (data.message == 16 || data.parm.status == 1) {
                $scope.colColor="";
            }else if(data.message == 0 || data.parm.status == 0){
                $scope.colColor="#F96A39";
            }else{
                FormatRusult.format(data.message).then(function (data){
                    GetListService.alertTip(data);
                })
            }
        })
    }
    //查询兼职内容
    GetListService.getList(jobApi).then(function (data){
        $scope.item = data.data.data;
        console.log($scope.item);
    })
    //查询指定ID下的评论
    GetListService.getList(commentApi).then(function (data){
        $scope.comments = data.data.data.list;
        $scope.commentsCount = data.data.data.resultCount;
        if ($scope.commentsCount >= 8) {
            $scope.emptyContent = true;
        }
    })
    //加载更多评论
    $scope.loadMoreCom = function (){
        pageNumber++;
        var pageKey = "?pageNumber="+pageNumber+"&pageSize="+pageSize;
        var api = "http://120.24.218.56/api/review/job/"+userId+pageKey;
        GetListService.getList(api).then(function (data){
            if (data.data.data.list.length == 8) {
                $scope.comments = $scope.comments.concat(data.data.data.list);
            }else{
                $scope.comments = $scope.comments.concat(data.data.data.list);
                $scope.emptyContent = false;
            }
        })
    }

    //提交评论
    $scope.sendComment = function (){
        var data = "content="+$scope.commentData;
        if ($scope.commentData == " "||$scope.commentData == null) {
            GetListService.alertTip("评论内容不能为空！");
            return false;
        };
        var jsonData = {
            member: {
                profilePhotoId: $scope.inUser.profilePhotoId,
                username: $scope.inUser.username
            },
            content:$scope.commentData
        }
        GetListService.userPost(subCommentApi,data).then(function (data){
            if (data.message == 0 || data.result == true) {
                $scope.comments.unshift(jsonData);
                $scope.commentData = [];
            }else{
                FormatRusult.format(data.message).then(function (data){
                    GetListService.alertTip(data);
                })
            }
        })
    }
    //显示删除盒子
    $scope.showBox = function(delList,commentId){
        var hideSheet = $ionicActionSheet.show({
             buttons: [
               { text: '删除' }
             ],
             titleText: '选择操作',
             cancelText: '取消',
             cancel: function() {
                  // add cancel code..
                },
             buttonClicked: function(index) {
                //执行删除操作
                var delApi = "http://120.24.218.56/user/job/"+userId+"/review/delete/"+commentId+tokenKey;
                GetListService.userPost(delApi,{}).then(function (data){
                    console.log(data)
                    if (data.message == 0) {
                        $scope.comments.splice(delList,1);
                    }else{
                        FormatRusult.format(data.message).then(function (data){
                            GetListService.alertTip(data);
                        })
                    }
                })
                return true;
             }
        });
    }
 })

//加载二级目录
.controller('getRegionAndPayCotroller',function ($scope, GetListService, $rootScope){
    //获取二级目录
    var categoryApi = "http://120.24.218.56/api/job/cate/list";
    GetListService.getList(categoryApi).then(function (data){
        $scope.items = data.data.data.list;
    })
    //初始化：隐藏二级选项菜单
    $scope.selecting = {
        location:false,
        paytype:false
    }
    //显示二级选项菜单
    $scope.showModal = function (value){
        if (value == "location")
            $scope.selecting.location = !$scope.selecting.location;
        if (value == "paytype") 
            $scope.selecting.paytype = !$scope.selecting.paytype;
        if (value == "class") 
            $scope.selecting.class = !$scope.selecting.class;
    }
    var locations = ["张店区","周村区","淄川区","临淄区","博山区","桓台区","高青区","沂源县"];
    var paytypes = ["日结","周结","月结","完工结算"];
    $scope.locations = locations;
    $scope.paytypes = paytypes;
})
//按二级目录进行搜索查询，并将消息和Api传递给父控制器
.controller('getJobCateListCotroller', function ($scope, $state, GetListService){
    //按照分类目录进行搜索
    $scope.goClass = function (data){
        var api = "http://120.24.218.56/api/job/category/"+data;
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.class = !$scope.selecting.class;
        })
    }
    //按照区域进行搜索
    $scope.goLocation = function (data){
        var key = "?region="+data;
        var api = "http://120.24.218.56/api/job/search"+key;
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.location = !$scope.selecting.location;
        })
    }
    //按照支付方式进行搜索
    $scope.goPaytype = function (data){
        var key = "?timeToPay="+data;
        var api = "http://120.24.218.56/api/job/search"+key;
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting.paytype = !$scope.selecting.paytype;
        })
    }
    //显示所有信息
    $scope.loadAll = function (value){
        var api = "http://120.24.218.56/api/job/list";
        GetListService.getList(api).then(function (data){
            data.data.data.api = api;
            $scope.$emit('to-parent',data.data.data);
            $scope.selecting[value] = !$scope.selecting[value];
        })
    }
})