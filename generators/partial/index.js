'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
var path = require('path');
var utils = require('../../utils.js');
var url = require('url');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        utils.getNameArg(this, 'Angular Partial');
    },
    prompting: function () {
        var cb = this.async();

        var prompts = [{
            name: 'route',
            message: 'Enter your route url (i.e. /mypartial/:id).  If you don\'t want a route added for you, leave this empty.'
        }];

        utils.addNamePrompt(this, prompts, 'partial');

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            this.route = url.resolve('',props.route);
            utils.askForModuleAndDir('parial', this, true, cb);
        }.bind(this));

    },
    writing: function () {
        var defaultDir = '';
        var toFolder = this.dir;
        var data = {
            appname: this.module.name,
            ctrlname: _.camelCase(_.capitalize(this.name)) + 'Ctrl'
        };
        utils.processTemplate(defaultDir + '/partial.js', toFolder + '/' + this.name + '.js', data,this);
        utils.processTemplate(defaultDir + '/partial-spec.js', toFolder + '/' + this.name + '-spec.js', data,this);
        utils.processTemplate(defaultDir + '/partial.less', toFolder + '/' + this.name + '.less', data,this);
        utils.processTemplate(defaultDir + '/partial.html', toFolder + '/' + this.name + '.html', data,this);
        if (this.route && this.route.length > 0) {
            var partialUrl = this.dir + this.name + '.html';
            utils.injectRoute(this.module.file, this.config.get('uirouter'), this.name, this.route, partialUrl, this);
        }
    }
})
;
