angular.module('directives.dropdown',[])
//dropdown directive
.directive('dropdown', function($document) {
	return {
		restrict: "C",
		link: function(scope, elem, attr) {
			elem.bind('click', function() {
				elem.toggleClass('dropdown-active');
				elem.addClass('active-recent');
			});
			$document.bind('click', function() {
				if(!elem.hasClass('active-recent')) {
					elem.removeClass('dropdown-active');
				}
				elem.removeClass('active-recent');
			});
		}
	}
})
.directive("ngFocus",[function (){
	var FOCUS_CLASS = "ng-focused";
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function (scope, element, attrs, ctrl){
			ctrl.$focused = false;
			element.bind('focus', function (evt){
				element.addClass(FOCUS_CLASS);
				scope.$apply(function (){
					ctrl.$focused = true;
				})
			})
			.bind('blur', function (evt){
				element.removeClass(FOCUS_CLASS);
				scope.$apply(function (){
					ctrl.$focused = false;
				})
			})
		}
	}
}])