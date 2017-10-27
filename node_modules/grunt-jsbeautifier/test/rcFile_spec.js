"use strict";
/*jshint -W079*/
var chai = require("chai"),
    expect = chai.expect,
    ncp = require("ncp").ncp,
    grunt = require("grunt"),
    JsBeautifierTask = require("../lib/jsbeautifier"),
    createMockTask = require("./mockTask");
chai.use(require('chai-fs'));

/*jshint -W030*/
describe("JsBeautifier: rc file test", function() {
    var mockTask;

    beforeEach(function(done) {
        grunt.file.mkdir("tmp/rcFile");
        ncp("test/fixtures/configFile", "tmp/rcFile", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
        grunt.file.delete(".jsbeautifierrc");
    });

    function assertBeautifiedFile(actualFile, expectedFile) {
        var actual = "tmp/rcFile/" + actualFile,
            expected = grunt.file.read("tmp/rcFile/" + expectedFile);

        expect(actual).to.have.content(expected, "should beautify js " + actualFile + " using config file");
    }

    it("beautification of js, css & html file using settings from rc file", function(done) {
        var task;
        ncp("tmp/rcFile/jsbeautifyrc.json", ".jsbeautifierrc", function() {
            /*config: "tmp/configFile/jsbeautifyrc.json"*/
            mockTask = createMockTask({}, ["tmp/rcFile/test.js", "tmp/rcFile/test.css", "tmp/rcFile/test.html"], function() {
                assertBeautifiedFile("test.js", "expected/test_expected.js");
                assertBeautifiedFile("test.css", "expected/test_expected.css");
                assertBeautifiedFile("test.html", "expected/test_expected.html");
                done();
            });

            task = new JsBeautifierTask(mockTask);
            console.log('Running task');
            task.run();
        });
    });

    it("beautification of js, css & html file using settings from flat rc file", function(done) {
        var task;
        ncp("tmp/rcFile/jsbeautifyrc_flat.json", ".jsbeautifierrc", function() {
            /*config: "tmp/configFile/jsbeautifyrc_flat.json"*/
            mockTask = createMockTask({}, ["tmp/rcFile/test.js", "tmp/rcFile/test.css", "tmp/rcFile/test.html"], function() {
                assertBeautifiedFile("test.js", "expected/test_expected.js");
                assertBeautifiedFile("test.css", "expected/test_expected.css");
                assertBeautifiedFile("test.html", "expected/test_expected.html");
                done();
            });

            task = new JsBeautifierTask(mockTask);
            task.run();
        });
    });

    it("beautification of js, css & html file using settings from rc file and gruntfile", function(done) {
        var task;
        ncp("tmp/rcFile/jsbeautifyrc_flat.json", ".jsbeautifierrc", function() {
            /*config: "tmp/configFile/jsbeautifyrc_flat.json",*/
            mockTask = createMockTask({
                css: {
                    indentSize: 5
                },
                html: {
                    indentSize: 7
                }
            }, ["tmp/rcFile/test.js", "tmp/rcFile/test.css", "tmp/rcFile/test.html"], function() {
                assertBeautifiedFile("test.js", "expected/withGruntFileOptions/test_expected.js");
                assertBeautifiedFile("test.css", "expected/withGruntFileOptions/test_expected.css");
                assertBeautifiedFile("test.html", "expected/withGruntFileOptions/test_expected.html");
                done();
            });

            task = new JsBeautifierTask(mockTask);
            task.run();
        });
    });
});
