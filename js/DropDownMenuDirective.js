angular.module('directives.dropdown',[])
.directive('buttonMenu', function ($document){
	return {
		restrict:'E',
		replace:true,
		transclude:true,
		scope:{
			iconCls:'@'
		},
		link:function ($scope, $element){
			var wrapper = $element.find("button-menu-wrapper");
			var body = $document.find("body");
			$element.bind("click",function (){
				event.stopPropagation();
				wrapper.find("div").toggleClass("active");
			});
			body.find("click", function (){
				wrapper.find("div").removeClass("active");
			});
		},
		template: '<div class="button button-icon">' +
                '<i ng-class="iconCls" ng-if="iconCls"></i>'+
                '<span ng-transclude></span>'+
                '</div>'
	}
})
.directive('buttonMenuWrapper',function($document) {
        return {
            restrict:'E',
            require:'^buttonMenu',
            transclude:true,
            scope: {
                leftPosition:'@',
                rightPosition:'@'
            },
            template:'<div class="list dropdown" ng-transclude></div>'
        }
    })