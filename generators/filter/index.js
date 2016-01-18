'use strict';
var yeoman = require('yeoman-generator');
var utils = require('../../utils.js');
module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        utils.getNameArg(this,'Angular Filter');
    },
    prompting: function () {
        var cb = this.async();

        var prompts = [];

        utils.addNamePrompt(this, prompts, 'filter');

        this.prompt(prompts, function (props) {
            if (props.name) {
                this.name = props.name;
            }
            utils.askForModuleAndDir('filter', this, false, cb);
        }.bind(this));
    },
    writing: function () {
        var data = {
            appname: this.module.name,
            name: this.name
        };
        utils.processTemplate('filter.js', this.name + '.js', data, this);
        utils.processTemplate('filter-spec.js', this.name + '-spec.js', data, this);

    }
});
