angular.module('<%= appname %>').factory('<%= _.capitalize(_.camelCase(name)) %>',function() {

    var <%= _.camelCase(name) %> = {};

    return <%= _.camelCase(name) %>;
});