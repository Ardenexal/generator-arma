'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var utils = require('../../utils.js');
var _ = require('lodash');
module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        utils.getNameArg(this, 'Angular Directive');
    },
    prompting: function () {
        var cb = this.async();

        var prompts = [];
        utils.addNamePrompt(this, prompts, 'service');

        prompts.push({
            type: 'confirm',
            name: 'needpartial',
            message: 'Does this directive need an external html file (i.e. partial)?',
            default: true
        });
        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            this.needpartial = props.needpartial;
            utils.askForModuleAndDir('directive', this, this.needpartial, cb);
        }.bind(this));

        utils.addNamePrompt(this, prompts, 'directive');
    },
    writing: function () {
        var defaultDir = 'simple';
        var toFolder = this.dir;
        var data = {
            appname: this.module.name,
            name: this.name,
            htmlPath: path.join(this.dir, this.name + '.html').replace(/\\/g, '/')
    };
        if (this.needpartial) {
            defaultDir = 'complex';
            utils.processTemplate(defaultDir + '/directive.html', toFolder + '/' + this.name + '.html', data,this);
            utils.processTemplate(defaultDir + '/directive.less', toFolder + '/' + this.name + '.less', data,this);
        }
        utils.processTemplate(defaultDir + '/directive.js', toFolder + '/' + this.name + '.js', data,this);
        utils.processTemplate(defaultDir + '/directive-spec.js', toFolder + '/' + this.name + '-spec.js', data,this);
    }
})
;
