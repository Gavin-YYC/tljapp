/*
 *
 * list Controller （兼职列表页）
 * listApi：http://120.24.218.56/api/job/list
 * test listApi : http://localhost:8100/js/data.js
 * cateListApi：http://120.24.218.56/api/job/category/
 * test cateListApi : http://localhost:8100/js/category.json
 *
*/
angular.module('starter.controllers',['search.controllers','my.controllers'])
.controller('ListController',function($scope,$http,$ionicPopup,$ionicModal,$stateParams,GetListService){

    //初始化 请求页面参数
    var pageBase = 0;
    var pageSize = 8;
    var cateId = $stateParams.id;
    var listApi = "http://120.24.218.56/api/job/list";
    //var listApi = "http://localhost:8100/js/data.js";
    var cateListApi = "http://120.24.218.56/api/job/category/"+cateId;
    //var categoryApi = "http://localhost:8100/js/category.json";

    if (cateId == 0) {
        //列表页加载时产生的数据
        $http.get(listApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    console.log(newItems);
                    $scope.items = newItems.data;
                    console.log($scope.items);
                }else{
                    //else code
                };
            })
    }else{
        $http.get(cateListApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    $scope.items = newItems.data;
                }else{
                    //else code
                };
            })
    };
    


    //下拉更新操作，数据更新，并进行提示
    $scope.doRefresh = function(){
        if (cateId==0) {
            pageBase++;
            $http.get(listApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
                .success(function(newItems) {
                    if (newItems.ok == true && newItems.data.length > 0) {
                        for (var i = 0; i < newItems.data.length; i++) {
                            $scope.items.unshift(newItems.data[i]);
                        }; 
                        GetListService.alertTip("刷新成功！");
                    }else if(newItems.ok == true && newItems.data.length == 0) {
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
            $http.get(cateListApi+"?pageNumber="+pageBase+"&pageSize="+pageSize)
                .success(function(newItems) {
                    if (newItems.ok == true && newItems.data.length > 0) {
                        for (var i = 0; i < newItems.data.length; i++) {
                            $scope.items.unshift(newItems.data[i]);
                        }; 
                        GetListService.alertTip("刷新成功！");
                    }else if(newItems.ok == true && newItems.data.length == 0) {
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

    //modal弹出模态窗口，用于选择分类、结算和区域
    $ionicModal.fromTemplateUrl('modal-location.html',function(modal){
        $scope.modalLocation = modal;
    },{
        animation: 'slide-in-up'
    });

    //modal弹出模态窗口，用于选择分类、结算和区域
    $ionicModal.fromTemplateUrl('modal-pay.html',function(modal){
        $scope.modalPaytype = modal;
    },{
        animation: 'slide-in-up'
    });


})

/*
 *
 * Detail Controller （兼职详情页）
 * jobApi：http://120.24.218.56/api/job/{{id}}
 * commentApi：http://120.24.218.56/api/review/job/{{id}}
 * test jobApi : http://localhost:8100/js/detail.json
 * test commentApi : http://localhost:8100/js/pinglun.json
 *
*/
.controller('DetailController',function($scope,$http,$stateParams){
    $scope.id = $stateParams.id;
    var jobApi = "http://120.24.218.56/api/job/";
    var commentApi = "http://120.24.218.56/api/review/job/"

    //查询兼职内容
    //注意，这里在生成app的时候，改下get中的参数，"jobApi+$scope.id"
    $http.get(jobApi+$scope.id)
        .success(function(jobDetail){
            if (jobDetail.ok == true) {
                $scope.item = jobDetail.data;
            };
        })

    //查询指定ID下的评论
    //注意，这里在生成app的时候，改下get中的参数，"commentApi+$scope.id"
    $http.get(commentApi+$scope.id)
        .success(function(commentDetail){
            if (commentDetail.ok == true) {
                $scope.comments = commentDetail.data.list;
                console.log($scope.comments);
            };
        })

 })

/*
 *
 * 获取二级目录
 * api：http://120.24.218.56/api/job/cate/list
 * test api : http://localhost:8100/js/category.json
 *
*/
.controller('getCategoriesCotroller',function($scope,$http,$location,GetListService){
    var categoryApi = "http://120.24.218.56/api/job/cate/list";
    GetListService.getList(categoryApi)
        .success(function (data,status){
            $scope.categories = data.data;
        })
    $scope.goList = function(id){
        $location.url("list/"+id); 
    }
})

.controller('getRegionAndPayCotroller',function($scope,$http){
    var locations = ["张店区","周村区","淄川区","临淄区","博山区","桓台区","高青区","沂源县"];
    var paytypes = ["日结","周结","月结","完工结算"];
    $scope.locations = locations;
    $scope.paytypes = paytypes;

    $scope.searchApi = "http://120.24.218.56/api/job/search";

    $scope.getPayTypeList = function(paytype){

        var key = "?timeToPay="+paytype;
        var searchApi = $scope.searchApi + key;

        console.log(searchApi);
        
        $http.get(searchApi)
            .success(function(newItems) {
                if (newItems.ok == true) {
                    console.log(newItems.data);
                    $scope.items = newItems.data;
                }else{
                    //else code
                };
            })
    }
    $scope.getLocationList = function(location){
        var key = "?region="+location;
        var searchApi = $scope.searchApi;

        console.log(searchApi);
        console.log(key);
        $http.get(searchApi+key)
            .success(function(newItems) {
                console.log(newItems);
                if (newItems.ok == true) {
                    $scope.items = newItems.data;
                }else{
                    //else code
                };
            })
    }
})