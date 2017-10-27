"use strict";

var grunt = require("grunt"),
    semver = require("semver"),
    spawnOptions = {
        cmd: "npm",
        grunt: false,
        opts: {
            cwd: __dirname
        }
    };

function updateJsBeautify(version, done) {
    spawnOptions.args = ["install", "js-beautify@" + version];
    grunt.util.spawn(spawnOptions, done);
}

module.exports = function verifyJsBeautifyVersion(version, done) {
    if (!version) {
        return done();
    }
    spawnOptions.args = ["list", "js-beautify", "--json"];
    grunt.util.spawn(spawnOptions, function(error, result) {
        if (error) {
            return done(error);
        }
        var jsonResults = JSON.parse(result.stdout),
            jsBeautify = jsonResults.dependencies && jsonResults.dependencies["js-beautify"];
        if (!semver.satisfies(jsBeautify.version, version)) {
            grunt.log.writeln("Updating version of js-beautify to " + version);
            return updateJsBeautify(version, done);
        }
        grunt.verbose.writeln("Version of js-beautify is already updated " + version);
        return done();
    });

};
