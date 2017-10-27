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
describe("JsBeautifier: Command Line Parameter test", function() {
    var mockTask;

    beforeEach(function(done) {
        grunt.file.mkdir("tmp/commandLine");
        ncp("test/fixtures/common", "tmp/commandLine", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
    });

    function assertBeautifiedFile() {
        var actual = "tmp/commandLine/not-been-beautified.js",
            expected = grunt.file.read("tmp/commandLine/been-beautified.js");
        expect(actual).to.have.content(expected, "should beautify js file passed via command line");
    }

    it("Verify beautification of file passed via command line", function(done) {
        var task;
        mockTask = createMockTask({}, [], ["file", "tmp/commandLine/not-been-beautified.js"], function() {
            assertBeautifiedFile();
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });
});
