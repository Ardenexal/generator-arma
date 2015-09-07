angular.module('<%= appname %>').directive('<%= _.camelCase(name) %>', function() {
    return {
        restrict: 'E',
        scope: {

        },
        templateUrl: '<%= htmlPath %>',
        link: function(scope, element, attrs, fn) {


        }
    };
});
