"use strict";

var path = require("path"),
    grunt = require("grunt"),
    _ = require("lodash"),
    async = require("async"),
    stringUtils = require("underscore.string"),
    JsBeautifierTask = function(task) {
        // Store reference to original task
        this.task = task;
        var args = {};

        task.args.forEach(function(item, index) {
            if (index % 2 === 0) {
                args[item] = task.args[index + 1];
            }
        });
        this.args = args;

        // Merge task options with defaults
        this.options = task.options(JsBeautifierTask.DEFAULT_OPTIONS);
    },
    addJsNewLine = true,
    jsBeautifyVersion = require("./jsBeautifyVersion");

/**
 * Default options that will be merged with options specified in
 * the original task.
 *
 * @type {*}
 */
JsBeautifierTask.DEFAULT_OPTIONS = {
    mode: "VERIFY_AND_WRITE",
    dest: "",
    js: {},
    css: {},
    html: {}
};

/**
 * Static method for registering an instance of the task with Grunt.
 *
 * @param {*} grunt
 */
JsBeautifierTask.registerWithGrunt = function(grunt) {
    grunt.registerMultiTask("jsbeautifier", "jsbeautifier.org for grunt", function() {
        var task = new JsBeautifierTask(this);
        task.run();
    });
};

function getFileType(file, config) {
    var fileType = null,
        fileMapping = {
            "js": config.js.fileTypes,
            "css": config.css.fileTypes,
            "html": config.html.fileTypes
        };
    _.forEach(fileMapping, function(extensions, type) {
        fileType = type;
        return -1 === _.findIndex(extensions, function(ext) {
            return stringUtils.endsWith(file, ext);
        });
    });
    return fileType;
}

function getBeautifierSetup(file, config) {
    var fileType = getFileType(file, config),
        jsBeautify = require("js-beautify");
    switch (fileType) {
        case "js":
            return [jsBeautify.js, config.js, addJsNewLine];
        case "css":
            return [jsBeautify.css, config.css];
        case "html":
            return [jsBeautify.html, config.html];
        default:
            grunt.fail.warn("Cannot beautify " + file.cyan + " (only js, css and html files can be beautified)");
            return null;
    }
}

function beautify(file, config, actionHandler) {
    var setup = getBeautifierSetup(file, config);
    if (!setup) {
        return;
    }

    var beautifier = setup[0],
        beautifyConfig = setup[1],
        addNewLine = setup[2];

    var original = grunt.file.read(file);
    grunt.verbose.write("Beautifying " + file.cyan + "...");
    var result = beautifier(original, beautifyConfig);

    // jsbeautifier would skip the line terminator for js files
    if (!result.charAt(result.length - 1).match(/[\n\r\u2028\u2029]/) && addNewLine) {
        result += "\n";
    }
    grunt.verbose.ok();
    /*jshint eqeqeq: false */
    if (original != result) {
        actionHandler(file, result);
    }
}

JsBeautifierTask.prototype.run = function() {
    var options = this.options,
        args = this.args;

    var fileCount = 0,
        changedFileCount = 0,
        unVerifiedFiles = [];

    function verifyActionHandler(src) {
        unVerifiedFiles.push(src);
    }

    function verifyAndWriteActionHandler(src, result) {
        grunt.verbose.writeln(options.dest + src);
        grunt.file.write(options.dest + src, result);
        changedFileCount++;
    }

    function convertCamelCaseToUnderScore(config) {
        var underscoreKey;
        _.forEach([config.js, config.css, config.html], function(conf) {
            _.forEach(conf, function(value, key) {
                underscoreKey = stringUtils.underscored(key);
                if ("fileTypes" !== key && key !== underscoreKey) {
                    conf[underscoreKey] = value;
                    delete conf[key];
                }
            });
        });
    }

    function getConfig() {
        var config,
            rcFile = require("rc")("jsbeautifier", {});

        if (options.config || !_.isEqual(rcFile, {})) {
            var baseConfig = options.config ? grunt.file.readJSON(path.resolve(options.config)) : rcFile;
            config = {
                js: {},
                css: {},
                html: {}
            };
            if (!baseConfig.js && !baseConfig.css && !baseConfig.html) {
                _.extend(config.js, baseConfig);
                _.extend(config.css, baseConfig);
                _.extend(config.html, baseConfig);
            }
            _.extend(config.js, baseConfig.js);
            _.extend(config.css, baseConfig.css);
            _.extend(config.html, baseConfig.html);
            _.extend(config.js, options.js);
            _.extend(config.css, options.css);
            _.extend(config.html, options.html);
        } else {
            config = options;
        }
        config.js.fileTypes = _.union(config.js.fileTypes, [".js", ".json", '.es6']);
        config.css.fileTypes = _.union(config.css.fileTypes, [".css"]);
        config.html.fileTypes = _.union(config.html.fileTypes, [".html"]);

        grunt.verbose.writeln("Beautify config before converting camelcase to underscore: " + JSON.stringify(config));

        convertCamelCaseToUnderScore(config);

        grunt.verbose.writeln("Using beautify config: " + JSON.stringify(config));
        return config;
    }

    var sourceFiles = this.task.files,
        done = this.task.async();
    if ((sourceFiles && sourceFiles.length > 0) || !_.isEmpty(args.file)) {
        if (!_.isEmpty(options.dest)) {
            grunt.verbose.writeln("All beautified files will be stored under \"" + options.dest + "\" folder");
            if (!stringUtils.endsWith(options.dest, "/")) {
                options.dest += "/";
            }
        }

        grunt.verbose.writeln("Using mode=\"" + options.mode + "\"...");
        var actionHandler = "VERIFY_ONLY" === options.mode ? verifyActionHandler : verifyAndWriteActionHandler,
            config = getConfig();

        /** Add new line for js file unless specified as false */
        addJsNewLine = config.js.end_with_newline !== false;

        jsBeautifyVersion(options.jsBeautifyVersion, function(error) {
            if (error) {
                grunt.fail.fatal("Unable to update js-beautify version to " + options.jsBeautifyVersion + " due to \n" + error);
                return done(error);
            }
            var q = async.queue(function(src, callback) {
                if (grunt.file.isDir(src)) {
                    callback();
                    return;
                }

                beautify(src, config, actionHandler);
                fileCount++;
                callback();
            }, 10);

            q.drain = function() {
                if (unVerifiedFiles.length) {
                    grunt.fail.warn("The following files are not beautified:\n" + unVerifiedFiles.join("\n").cyan + "\n");
                }
                grunt.log.write("Beautified " + fileCount.toString().cyan + " files, changed " + changedFileCount.toString().cyan + " files...");
                grunt.log.ok();
                done();
            };

            if (!_.isEmpty(args.file)) {
                q.push(args.file);
            } else {
                sourceFiles.forEach(function(fileset) {
                    q.push(fileset.src);
                });
            }
        });
    }
};

module.exports = JsBeautifierTask;
