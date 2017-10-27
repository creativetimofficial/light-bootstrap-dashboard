"use strict";

/*jshint -W079*/
var chai = require("chai"),
    expect = chai.expect,
    grunt = require("grunt"),
    JsBeautifierTask = require("../lib/jsbeautifier");

/*jshint -W030*/
describe("Register task", function() {

    it("should register itself with Grunt", function() {
        expect(JsBeautifierTask.registerWithGrunt).to.exist;
        grunt.task._tasks.jsbeautifier = undefined;

        JsBeautifierTask.registerWithGrunt(grunt);
        expect(grunt.task._tasks.jsbeautifier).to.exist;
    });
});
