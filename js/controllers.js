/* 兼职页面控制器 */
angular.module('starter.controllers',['search.controllers','my.controllers'])
.controller('ListController',function($scope,$http,$ionicPopup,$ionicModal,$stateParams,GetListService){
    //初始化 请求页面参数
    var pageBase = 0;
    var pageSize = 8;
    var cateId = $stateParams.id;
    var listApi = "http://120.24.218.56/api/job/list";
    var cateListApi = "http://120.24.218.56/api/job/category/"+cateId;
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
.controller('DetailController',function ($scope, $http, $stateParams, GetListService){
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
.controller('getCategoriesCotroller',function($scope,$http,$location,GetListService){
    var categoryApi = "http://120.24.218.56/api/job/cate/list";
    GetListService.getList(categoryApi).then(function (data){
            $scope.categories = data.data.list;
    })
    $scope.goList = function(id){
        $location.url("list/"+id); 
    }
})

/* 按地区和结算方式搜索 */
.controller('getRegionAndPayCotroller',function($scope,$http,$location){
    var locations = ["张店区","周村区","淄川区","临淄区","博山区","桓台区","高青区","沂源县"];
    var paytypes = ["日结","周结","月结","完工结算"];
    $scope.locations = locations;
    $scope.paytypes = paytypes;
    $scope.searchApi = "http://120.24.218.56/api/job/search";
    $scope.locationChange = function (){
        $location.url("search/"+"region/"+$scope.select.location);
    }
    $scope.paytypeChange = function (){
        $location.url("search/"+"timeToPay/"+$scope.select.paytype);
    }
})

//加载loading
.controller('LoadingCtrl', function ($scope, $ionicLoading) {
    $scope.$on('loadingShow',function(event,data){
        $scope.show()
    })
    $scope.$on('loadingHide',function(event,data){
        $scope.hide()
    })
    $scope.show = function () {
        $ionicLoading.show({
            template: '<svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
        '<g id="circle" class="g-circles g-circles--v2">'+
        '<circle id="12" transform="translate(35, 16.698730) rotate(-30) translate(-35, -16.698730) " cx="35" cy="16.6987298" r="10"></circle>'+
        '<circle id="11" transform="translate(16.698730, 35) rotate(-60) translate(-16.698730, -35) " cx="16.6987298" cy="35" r="10"></circle>'+
        ' <circle id="10" transform="translate(10, 60) rotate(-90) translate(-10, -60) " cx="10" cy="60" r="10"></circle>'+
        ' <circle id="9" transform="translate(16.698730, 85) rotate(-120) translate(-16.698730, -85) " cx="16.6987298" cy="85" r="10"></circle>'+
        ' <circle id="8" transform="translate(35, 103.301270) rotate(-150) translate(-35, -103.301270) " cx="35" cy="103.30127" r="10"></circle>'+
        '<circle id="7" cx="60" cy="110" r="10"></circle>'+
        '<circle id="6" transform="translate(85, 103.301270) rotate(-30) translate(-85, -103.301270) " cx="85" cy="103.30127" r="10"></circle>'+
        '<circle id="5" transform="translate(103.301270, 85) rotate(-60) translate(-103.301270, -85) " cx="103.30127" cy="85" r="10"></circle>'+
        '<circle id="4" transform="translate(110, 60) rotate(-90) translate(-110, -60) " cx="110" cy="60" r="10"></circle>'+
        ' <circle id="3" transform="translate(103.301270, 35) rotate(-120) translate(-103.301270, -35) " cx="103.30127" cy="35" r="10"></circle>'+
        ' <circle id="2" transform="translate(85, 16.698730) rotate(-150) translate(-85, -16.698730) " cx="85" cy="16.6987298" r="10"></circle>'+
            ' <circle id="1" cx="60" cy="10" r="10"></circle>'+
            '</g>'+
            '</svg>'+
            '<div>加载中...</div>'
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };
});