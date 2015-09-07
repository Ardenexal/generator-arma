'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var cgUtils = require('../../utils');
module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the phenomenal ' + chalk.red('GeneratorArdenexal') + ' generator!'
        ));

        var prompts = [{
            name: 'appname',
            message: 'What would you like the angular app/module name to be?',
            default: path.basename(process.cwd())
        }, {
            name: 'scriptlanguage',
            type: 'list',
            message: 'would you like to you use?',
            default: 0,
            choices: ['Javascript', 'Typescript']
        }, {
            name: 'router',
            type: 'list',
            message: 'Which router would you like to use?',
            default: 0,
            choices: ['Standard Angular Router', 'Angular UI Router']
        }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;
            this.appname = props.appname;
            if (props.router === 'Angular UI Router') {
                this.uirouter = true;
                this.routerJs = 'bower_components/angular-ui-router/release/angular-ui-router.js';
                this.routerModuleName = 'ui.router';
                this.routerViewDirective = 'ui-view';
            } else {
                this.uirouter = false;
                this.routerJs = 'bower_components/angular-route/angular-route.js';
                this.routerModuleName = 'ngRoute';
                this.routerViewDirective = 'ng-view';
            }
            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            this.directory('skeleton/', './');
            if (this.props.scriptlanguage === 'Typescript') {
                this.fs.copyTpl(
                    this.templatePath('ts/app.ejs'),
                    this.destinationPath('app.ts'),
                    {
                        uirouter: this.uirouter,
                        appname: this.appname,
                        routerModuleName:this.routerModuleName
                    }
                );
            } else {
                this.fs.copyTpl(
                    this.templatePath('js/app.ejs'),
                    this.destinationPath('app.js'),
                    {
                        uirouter: this.uirouter,
                        appname: this.appname,
                        routerModuleName:this.routerModuleName

                    }
                );
            }
        },

        projectfiles: function () {
            this.fs.copyTpl(
                this.templatePath('bower.ejs'),
                this.destinationPath('bower.json'),
                {
                    appname: this.appname,
                    uirouter: this.uirouter
                }
            );
            this.fs.copyTpl(
                this.templatePath('package.ejs'),
                this.destinationPath('package.json'),
                {
                    appname: this.appname,
                    uirouter: this.uirouter
                }
            );
            this.fs.copyTpl(
                this.templatePath('index.ejs'),
                this.destinationPath('index.html'),
                {
                    appname: this.appname,
                    uirouter: this.uirouter,
                    routerJs:this.routerJs,
                    routerViewDirective:this.routerViewDirective
                }
            );
        }
    },

    install: function () {
        this.installDependencies();
    },
    end: function () {
        this.config.set('partialDirectory', 'partial/');
        this.config.set('modalDirectory', 'partial/');
        this.config.set('directiveDirectory', 'directive/');
        this.config.set('filterDirectory', 'filter/');
        this.config.set('serviceDirectory', 'service/');
        this.config.set('language',this.props.scriptlanguage);
        this.config.set('uirouter',this.props.uirouter);
        var inject = {
            js: {
                file: 'index.html',
                marker: cgUtils.JS_MARKER,
                template: '<script src="<%= filename %>"></script>'
            },
            less: {
                relativeToModule: true,
                file: '<%= module %>.less',
                marker: cgUtils.LESS_MARKER,
                template: '@import "<%= filename %>";'
            }
        };
        this.config.set('inject', inject);
        this.config.save();
    }
});
