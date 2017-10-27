'use strict';

var grunt = require("grunt"),
    _ = grunt.util._;

module.exports = function mockTask(taskOptions, files, args, done) {
    if (_.isFunction(args)) {
        done = args;
        args = [];
    }
    return {
        _taskOptions: taskOptions,
        files: [{
            src: grunt.file.expand(files)
        }],
        options: function(defs) {
            return _.defaults(this._taskOptions, defs);
        },
        args: args || [],
        async: function() {
            return done || function() {};
        }
    };
};
