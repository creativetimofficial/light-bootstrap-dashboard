"use strict";

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        jshint: {
            files: ["package.json", "Gruntfile.js", "lib/**/*.js", "tasks/**/*.js", "test/**/*.js"],
            options: {
                jshintrc: true
            }
        },
        jsbeautifier: {
            default: {
                src: ["<%= jshint.files %>", "!test/fixtures/**", "package.json"]
            }
        },
        copy: {
            tmp: {
                src: ["**"],
                dest: "tmp",
                cwd: "test/fixtures",
                expand: true
            }
        },
        clean: ["tmp", "dest"],
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*_spec.js']
            }
        },
        devUpdate: {
            main: {
                options: {
                    updateType: 'force',
                    reportUpdated: false,
                    packages: {
                        devDependencies: true,
                        dependencies: true
                    }
                }
            }
        }
    });

    // Actually load this plugin"s task(s).
    grunt.loadTasks("tasks");

    // By default, beautify, lint and run all tests.
    grunt.registerTask("test", ["jshint", "copy", "clean", "mochaTest"]);
    grunt.registerTask("default", ["devUpdate", "test", "jsbeautifier:default"]);
};
