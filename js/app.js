// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('ActionSheetCtrl', function($scope, $ionicActionSheet) {
  $scope.messages = [];
  $scope.takeAction = function() {
    $ionicActionSheet.show({
      buttons: [
        { text: 'Share <i class="icon ion-share">' },
        { text: 'Edit <i class="icon ion-edit">' }
      ],
      destructiveText: 'Delete <i class="icon ion-trash-b">',
      titleText: 'Modify your album',
      cancelText: 'Cancel',
      cancel: function() {
        $scope.message('Cancel');
        return true;
      },
      buttonClicked: function(index) {
        $scope.message(index === 0 ? 'Share' : 'Edit');
        return true;
      },
      destructiveButtonClicked: function() {
        $scope.message('Delete');
        return true;
      }
    });
  };
  $scope.message = function(msg) {
    $scope.messages.unshift({
      text: 'User pressed ' + msg
    });
  };
});