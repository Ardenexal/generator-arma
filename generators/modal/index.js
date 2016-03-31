'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
var utils = require('../../utils');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        utils.getNameArg(this, 'Angular Modal');
    },
    prompting: function () {
        var cb = this.async();

        var prompts = [];

        utils.addNamePrompt(this, prompts, 'modal');

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            utils.askForModuleAndDir('modal', this, true, cb);
        }.bind(this));

    },
    writing: function () {
        var defaultDir = '';
        var toFolder = this.dir;
        this.ctrlname = _.capitalize(_.camelCase(this.name)) + 'Ctrl';
        var data = {
            appname: this.module.name,
            ctrlname: this.ctrlname
        };
        utils.processTemplate(defaultDir + '/modal.js', toFolder + '/' + this.name + '.js', data,this);
        utils.processTemplate(defaultDir + '/modal-spec.js', toFolder + '/' + this.name + '-spec.js', data,this);
        utils.processTemplate(defaultDir + '/modal.less', toFolder + '/' + this.name + '.less', data,this);
        utils.processTemplate(defaultDir + '/modal.html', toFolder + '/' + this.name + '.html', data,this);

        setTimeout((function () {

            console.log('');
            console.log('  Open this modal by using ' + chalk.bold('angular-ui-bootstrap') + ' module\'s ' + chalk.bold('$modal') + ' service:');
            console.log('');
            console.log('  $modal.open({');
            console.log('      templateUrl: \'' + path.join(this.dir, this.name + '.html') + '\',');
            console.log('      controller: \'' + this.ctrlname + '\'');
            console.log('  }).result.then(function(result){');
            console.log('      //do something with the result');
            console.log('  });');
            console.log('');

        }).bind(this), 200);
    }
});
