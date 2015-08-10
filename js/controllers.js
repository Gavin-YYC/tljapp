/* 兼职页面控制器 */
angular.module('starter.controllers',['my.controllers'])
.controller('ListController',function($scope,$http,$ionicPopup,$ionicModal,$stateParams,GetListService){
    //初始化 请求页面参数
    var pageBase = 0;
    var pageSize = 8;
    var cateId = $stateParams.id;
    var listApi = "http://120.24.218.56/api/job/list";
    var cateListApi = "http://120.24.218.56/api/job/category/"+cateId;

    $scope.$on('to-parent',function (event,data){
        if (data == "") {
            $scope.items = data;
            $scope.emptyContent = true;
        }else{
            $scope.items = data;
            $scope.emptyContent = false;
        };
    })

    //加载兼职首页的数据，0表示返回的所有数据，其他数值表示兼职分类下二级栏目的Id
    if (cateId == 0) {
        //列表页加载时产生的数据
        $http.get(listApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    console.log(newItems);
                    $scope.items = newItems.data.list;
                }else{
                    //else code
                };
            })
    }else{
        $http.get(cateListApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    console.log(newItems)
                    $scope.items = newItems.data.list;
                }else{
                    //else code
                };
            })
    };
    
    //下拉更新操作，数据更新，并进行提示
    $scope.doRefresh = function(){
        if (cateId==0) {
            pageBase++;
            console.log(listApi+"?pageNumber="+pageBase+"&pageSize="+pageSize);
            $http.get(listApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
                .success(function(newItems) {
                    if (newItems.ok == true && newItems.data.list.length > 0) {
                        for (var i = 0; i < newItems.data.list.length; i++) {
                            $scope.items.unshift(newItems.data.list[i]);
                        }; 
                        GetListService.alertTip("刷新成功！");
                    }else if(newItems.ok == true && newItems.data.list.length == 0) {
                        GetListService.alertTip("已经没有更多信息了");
                    }else{
                        GetListService.alertTip(newItems.message);
                    };
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }else{
            pageBase++;
            console.log(cateListApi+"?pageNumber="+pageBase+"&pageSize="+pageSize);
            $http.get(cateListApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
                .success(function(newItems) {
                    console.log(newItems);
                    if (newItems.ok == true && newItems.data.list.length > 0) {
                        for (var i = 0; i < newItems.data.list.length; i++) {
                            $scope.items.unshift(newItems.data.list[i]);
                        }; 
                        GetListService.alertTip("刷新成功！");
                    }else if(newItems.ok == true && newItems.data.list.length == 0) {
                        GetListService.alertTip("已经没有更多信息了");
                    }else{
                        GetListService.alertTip(newItems.message);
                    };
                })
                .finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
    }

    //modal弹出模态窗口，用于选择分类、结算和区域
    $ionicModal.fromTemplateUrl('modal-type.html',function(modal){
        $scope.modalType = modal;
    },{
        animation: 'slide-in-up'
    });
})

/* 兼职详情页，加载内容的同时加载评论 */
.controller('DetailController',function ($scope, $http, $stateParams, GetListService ,Auth){
    var userId = $stateParams.id;
    var jobApi = "http://120.24.218.56/api/job/"+userId;
    var commentApi = "http://120.24.218.56/api/review/job/"+userId;
    var subCommentApi = "http://120.24.218.56/user/job/"+userId+"/review/post";
    //查询兼职内容
    GetListService.getList(jobApi).then(function (data){
        $scope.item = data.data.data;
    })
    //查询指定ID下的评论
    GetListService.getList(commentApi).then(function (data){
        $scope.comments = data.data.data.list;
    })
    //提交评论
    $scope.sendComment = function (data){
        var data = "content="+data+"&member_id="+Auth.getToken();
        GetListService.userPost(subCommentApi,data).then(function (data){
            console.log(data);
        })
    }
 })

/* 获取二级目录 */
.controller('getCategoriesCotroller',function ($scope, $location, GetListService){
    var categoryApi = "http://120.24.218.56/api/job/cate/list";
    GetListService.getList(categoryApi).then(function (data){
        $scope.categories = data.data.data.list;
    })
    $scope.goList = function(id){
        $location.url("list/"+id); 
    }
})

/* 按地区和结算方式搜索 */
.controller('getRegionAndPayCotroller',function ($scope, GetListService, $rootScope){
    var locations = ["张店区","周村区","淄川区","临淄区","博山区","桓台区","高青区","沂源县"];
    var paytypes = ["日结","周结","月结","完工结算"];
    var searchApi = "http://120.24.218.56/api/job/search";
    var pageBase = 0;
    var pageSize = 8;
    $scope.locations = locations;
    $scope.paytypes = paytypes;
    //根据地区进行搜索
    $scope.locationChange = function (value){
        if (value == "") {
            return false;
        };
        var key = "?region="+value;
        var api = searchApi+key+"&pageNumber="+pageBase+"&pageSize="+pageSize;
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent',data.data.data.list);
        })
    }
    //根据结算方式进行搜索
    $scope.paytypeChange = function (value){
        if (value == "") {
            return false;
        };
        var key = "?timeToPay="+value;
        var api = searchApi+key+"&pageNumber="+pageBase+"&pageSize="+pageSize;
        GetListService.getList(api).then(function (data){
            $scope.$emit('to-parent',data.data.data.list);
        })
    }
})