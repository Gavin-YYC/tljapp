/*  This is my_2.controller
 *  Here is some controller in this file.
 *    --MyMessage		   （我的通知、信息）
 *-----------------------------------------
 *  my.controllers 
 *  Children Controlles Followed：
 *=========================================
 *    --IndexController    （主页控制器）
 *    --LoginController    （登录控制器）
 *    --RegisterController （注册控制器）
 *    --MyController       （个人中心控制器）
 *    --ChildPageController（个人中心进入各分页面路口）
 *    --FeedbackController （意见反馈中心控制器）
 *    --LogoutController   （注销控制器）
 *    --PostController     （发布兼职信息）
 *    --MyPostController   （我的发布）
 *    --MyFavController    （我的收藏）
 *    --ChangePwdController（修改密码）
 *=========================================+
*/
angular.module('my_2.controllers',[])
//我的个人信息
.controller('MyMessage', function ($scope){
 	$scope.listCanSwipe = true
})