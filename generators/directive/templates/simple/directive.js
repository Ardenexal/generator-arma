angular.module('<%= appname %>').directive('<%= _.camelCase(name) %>', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, fn) {


        }
    };
});