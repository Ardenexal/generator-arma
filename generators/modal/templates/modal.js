angular.module('<%= appname %>').controller('<%= ctrlname %>', function ($scope) {
    $scope.save = function () {
        $scope.$close();
    };

});