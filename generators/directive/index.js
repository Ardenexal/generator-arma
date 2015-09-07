'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var cgUtils = require('../../utils.js');
var _ = require('lodash');
module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.argument('name', {
            required: true,
            type: String,
            desc: 'Angular Directive '
        });

    },
    prompting: function () {
        var cb = this.async();
        var prompts = [{
            type: 'confirm',
            name: 'needpartial',
            message: 'Does this directive need an external html file (i.e. partial)?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            this.needpartial = props.needpartial;
            cgUtils.askForModuleAndDir('directive', this, this.needpartial, cb);
        }.bind(this));

        cgUtils.addNamePrompt(this, prompts, 'directive');
    },
    writing: function () {
        var files = [];
        var that = this;
        var configName = 'directiveSimpleTemplates';
        var defaultDir = 'simple';
        var toFolder = this.dir + '/' + this.name;
        if (this.needpartial) {
            configName = 'directiveComplexTemplates';
            defaultDir = 'complex';

            files.push({
                src: defaultDir + '/directive.html',
                dest: toFolder + '/'+ this.name+'.html'
            });
            files.push({
                src: defaultDir + '/directive.less',
                dest: toFolder + '/'+ this.name+'.less'

            });
        }
        files.push({
            src: defaultDir + '/directive.js',
            dest: toFolder + '/'+ this.name+'.js'
        });
        files.push({
            src: defaultDir + '/directive-spec.js',
            dest: toFolder + '/'+ this.name+'-spec.js'
        });


        _.each(files, function (n) {
            that.fs.copyTpl(
                that.templatePath(n.src),
                that.destinationPath(n.dest),
                {
                    appname: that.appname,
                    name: that.name,
                    htmlPath: path.join(that.dir, that.name + '.html').replace(/\\/g, '/')
                }
            )
        })
    }
})
;
