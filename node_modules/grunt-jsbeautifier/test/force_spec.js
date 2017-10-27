"use strict";
/*jshint -W079*/
var chai = require("chai"),
    expect = chai.expect,
    ncp = require('ncp').ncp,
    grunt = require("grunt"),
    JsBeautifierTask = require("../lib/jsbeautifier"),
    createMockTask = require("./mockTask");

/*jshint -W030*/
describe("JsBeautifier: Forced Success test", function() {
    var mockTask,
        oriGruntFailWarn = grunt.fail.warn,
        warnMessage;

    beforeEach(function(done) {
        grunt.fail.warn = function dummyWarn(err) {
            if (!grunt.option('force')) {
                warnMessage = err;
            }
        };
        grunt.file.mkdir("tmp/verifyMode");
        ncp("test/fixtures/verifyMode", "tmp/verifyMode", done);
    });

    afterEach(function() {
        warnMessage = null;
        mockTask = null;
        grunt.fail.warn = oriGruntFailWarn;
        grunt.file.delete("tmp");
        grunt.option('force', false);
    });

    it("passes with force option", function(done) {
        var task;
        mockTask = createMockTask({
            mode: "VERIFY_ONLY",
            force: true
        }, ["tmp/verifyMode/not-been-beautified.js", "tmp/verifyMode/not-been-beautified.css"], function() {
            expect(warnMessage).to.be.undefined;
            done();
        });

        grunt.option('force', true);

        task = new JsBeautifierTask(mockTask);
        task.run();
    });

});
