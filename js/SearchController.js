angular.module('search.controllers',[])
.controller('SearchController',function ($scope,$ionicModal){

    //modal弹出模态窗口，用于选择分类
    $ionicModal.fromTemplateUrl('modal-type.html',function(modal){
        $scope.modalType = modal;
    },{
        animation: 'slide-in-up'
    });

    //modal弹出模态窗口，用于选择区域
    $ionicModal.fromTemplateUrl('modal-location.html',function(modal){
        $scope.modalLocation = modal;
    },{
        animation: 'slide-in-up'
    });

    //modal弹出模态窗口，用于选择结算方式
    $ionicModal.fromTemplateUrl('modal-pay.html',function(modal){
        $scope.modalPaytype = modal;
    },{
        animation: 'slide-in-up'
    });
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