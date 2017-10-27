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
describe("JsBeautifier: Destination test", function() {
    var mockTask;

    beforeEach(function(done) {
        grunt.file.mkdir("tmp/common");
        ncp("test/fixtures/common", "tmp/common", done);
    });

    afterEach(function() {
        mockTask = null;
        grunt.file.delete("tmp");
        grunt.file.delete("dest");
    });

    function assertBeautifiedFile() {
        var actual = "dest/tmp/common/not-been-beautified.js",
            expected = grunt.file.read("tmp/common/been-beautified.js");
        expect(actual).to.have.content(expected, "should beautify js and put into dest folder");
    }

    it("Verify beautification with dest folder", function(done) {
        var task;
        mockTask = createMockTask({
            dest: "dest"
        }, ["tmp/common/not-been-beautified.js"], function() {
            assertBeautifiedFile();
            done();
        });

        task = new JsBeautifierTask(mockTask);
        task.run();
    });
});
