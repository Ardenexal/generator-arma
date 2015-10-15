'use strict';
var yeoman = require('yeoman-generator');
var utils = require('../../utils');
var fs = require('fs');
module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        utils.getNameArg(this, 'Angular Service Name');
    },
    prompting: function () {
        var cb = this.async();

        var prompts = [];

        utils.addNamePrompt(this, prompts, 'service');

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            utils.askForModuleAndDir('service', this, false, cb);
        }.bind(this));

    },
    writing: function () {
        var defaultDir = '';
        var toFolder = this.dir + '/' + this.name;
        var data = {
            appname: this.module.name,
            name: this.name
        };
        utils.processTemplate(defaultDir + '/service.js', toFolder + '/' + this.name + '.js', data,this);
        utils.processTemplate(defaultDir + '/service-spec.js', toFolder + '/' + this.name + '-spec.js', data,this);
    }
});
