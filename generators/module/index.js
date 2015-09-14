'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var utils = require('../../utils.js');
var chalk = require('chalk');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.uirouter = this.config.get('uirouter');
        this.scriptType = this.config.get('language');
        this.routerModuleName = this.uirouter ? 'ui.router' : 'ngRoute';
        utils.getNameArg(this, 'Angular Modal');
    },
    prompting: function () {
        var cb = this.async();
        var that = this;

        var prompts = [
            {
                name: 'dir',
                message: 'Where would you like to create the module (must specify a subdirectory)?',
                default: function (data) {
                    return path.join(that.name || data.name, '/');
                },
                validate: function (value) {
                    value = _.str.trim(value);
                    if (_.isEmpty(value) || value[0] === '/' || value[0] === '\\') {
                        return 'Please enter a subdirectory.';
                    }
                    return true;
                }
            }];
        utils.addNamePrompt(this, prompts, 'module');
        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            this.dir = path.join(props.dir, '/');
            cb();
        }.bind(this));
    },
    writing: function () {
        var that = this;
        var defaultDir = '';
        var to = this.dir + '/' + this.name;
        var module = utils.getParentModule(path.join(this.dir, '..'));
        var data = {
            appname: that.appname,
            name: that.name,
            htmlPath: path.join(that.dir, that.name + '.html').replace(/\\/g, '/'),
            routerModuleName: that.routerModuleName,
            uirouter: that.uirouter
        };
        module.dependencies.modules.push(_.camelCase(this.name));
        module.save();
        this.log.writeln(chalk.green(' updating') + ' %s', path.basename(module.file));

        utils.processTemplate(defaultDir + '/module.js.ejs', to + '.js', data, this);
        utils.processTemplate(defaultDir + '/module.less', to + '.less', data, this);


        var modules = this.config.get('modules');
        if (!modules) {
            modules = [];
        }
        modules.push({name: _.camelCase(this.name), file: path.join(this.dir, this.name + '.js')});
        this.config.set('modules', modules);
        this.config.save();
    }
});
