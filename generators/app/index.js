'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var utils = require('../../utils');
module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the phenomenal ' + chalk.red('Arma') + ' generator!'
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
            this.scriptlanguage = props.scriptlanguage;
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

    writing: function () {
        this.config.set('partialDirectory', 'partial/');
        this.config.set('modalDirectory', 'partial/');
        this.config.set('directiveDirectory', 'directive/');
        this.config.set('filterDirectory', 'filter/');
        this.config.set('serviceDirectory', 'service/');
        this.config.set('language', this.scriptlanguage);
        this.config.set('uirouter', this.uirouter);
        var inject = {
            js: {
                file: 'index.html',
                marker: utils.JS_MARKER,
                template: '<script src="<%= filename %>"></script>'
            },
            less: {
                relativeToModule: true,
                file: '<%= module %>.less',
                marker: utils.LESS_MARKER,
                template: '@import "<%= filename %>";'
            }
        };
        this.config.set('inject', inject);

        this.directory('skeleton/', './');
        var data = {
            appname: this.appname,
            uirouter: this.uirouter,
            routerJs: this.routerJs,
            routerViewDirective: this.routerViewDirective,
            routerModuleName: this.routerModuleName
        };
        utils.processTemplate('/index.html.ejs', '/index.html', data, this);
        if (this.scriptlanguage === 'Typescript') {
            utils.processTemplate('ts/app.ts.ejs', '/app.ts', data, this);
        } else {
            utils.processTemplate('js/app.js.ejs', '/app.js', data, this);
        }

        utils.processTemplate('/bower.json.ejs', '/bower.json', data, this);
        utils.processTemplate('/package.json.ejs', '/package.json', data, this);


    },
    install: function () {
        //this.installDependencies();
    },
    end: function () {
        this.config.save();
    }
});
