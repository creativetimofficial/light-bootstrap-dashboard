"use strict";
/*jshint -W079*/
var chai = require("chai"),
    expect = chai.expect,
    ncp = require('ncp').ncp,
    grunt = require("grunt"),
    JsBeautifierTask = require("../lib/jsbeautifier"),
    createMockTask = require("./mockTask");

chai.use(require('chai-fs'));
/*jshint -W030*/
describe("JsBeautifier: FileMapping test", function() {
    var mockTask;

    beforeEach(function(done) {
        grunt.file.mkdir("tmp/fileMapping");
        ncp("test/fixtures/fileMapping", "tmp/fileMapping", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
    });

    function assertBeautifiedFile(actualFile, expectedFile) {
        var actual = "tmp/fileMapping/" + actualFile,
            expected = grunt.file.read("tmp/fileMapping/" + expectedFile);
        expect(actual).to.have.content(expected, "should beautify js " + actualFile + " using config file");
    }

    it("beautification of js, css & html file using file mapping", function(done) {
        var task;
        mockTask = createMockTask({
            js: {
                fileTypes: [".js.erb"],
                maxPreserveNewlines: 2
            },
            css: {
                fileTypes: [".css.erb"]
            },
            html: {
                fileTypes: [".html.erb"],
                preserveNewLines: true,
                maxPreserveNewlines: 1
            }
        }, ["tmp/fileMapping/not-beautified.js.erb", "tmp/fileMapping/not-beautified.css.erb", "tmp/fileMapping/not-beautified.html.erb"], function() {
            assertBeautifiedFile("not-beautified.js.erb", "expected/beautified.js.erb");
            assertBeautifiedFile("not-beautified.css.erb", "expected/beautified.css.erb");
            assertBeautifiedFile("not-beautified.html.erb", "expected/beautified.html.erb");
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });
});
