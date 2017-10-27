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
describe("JsBeautifier: Javascript options", function() {
    var mockTask;

    beforeEach(function(done) {
        grunt.file.mkdir("tmp/common");
        ncp("test/fixtures/common", "tmp/common", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
    });

    function assertBeautifiedFile() {
        var actual = "tmp/common/not-been-beautified.js",
            expected = grunt.file.read("tmp/common/no-newline-beautified.js");
        expect(actual).to.have.content(expected, "should beautify js without newline");
    }

    it("Verify beautification with no new line for javascript file", function(done) {
        var task;
        mockTask = createMockTask({
            js: {
                endWithNewline: false
            }
        }, ["tmp/common/not-been-beautified.js"], function() {
            assertBeautifiedFile();
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });
});
