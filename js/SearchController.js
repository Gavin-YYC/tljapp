angular.module('search.controllers',[])
.controller('SearchController',function($scope,$http,$ionicPopup, $timeout,$ionicModal,$stateParams){

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
});