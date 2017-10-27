
'use strict';

/* jshint node: true */

var through = require('through');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;

module.exports = function() {

    // jshint validthis: true

    var buffer = [];

    function gather(file) {
        if (file.isNull())
            return;
        if (file.isStream())
            return this.emit('error', new PluginError('gulp-deporder',  'Streaming not supported'));
        buffer.push(file);
    }

    function complete() {
        try {
            var reordered = reorder();

            reordered.forEach(function(entry) {
                this.emit('data', entry);
            }, this);

            this.emit('end');
        } catch (ex) {
            this.emit('error', new PluginError('gulp-deporder', ex));
        }
    }

    var reInlineDependencies = /^\s*\/\/\s*require(?:s)?(?:\:)?\s+(.*)$/m;
    var reMultilineDependencies = /(\/\*\s*require(?:s)?(?:\:)?([\s\S]*?)\*\/)/m;

    function getRequired(file) {
        // Accepts a vinyl file object and searches it for dependencies.

        var result = {
            file: file,
            requires: []
        };

        if (file.contents) {
            var contents = file.contents.toString('utf8', 0, 1024);
            var match = reInlineDependencies.exec(contents);
            if (match) {
                result.requires = match[1].split(/\s+/);
            }

            match = reMultilineDependencies.exec(contents);
            if (match && match[2]) {
                match[2] = match[2].replace(/\r|\n/g, ' ').replace(/\s+/g, ' ').trim(' ');
                result.requires = result.requires.concat(match[2].split(/\s+/));
            }
        }

        return result;
    }

    function reorder() {

        // Instead of building an entire DAG we'll start with simple cycle detection by
        // tracking dependencies we've already tried (`moved`).

        var result = [];

        var remaining = buffer.map(getRequired);
        var copied = {}; // names of files already in result
        var moved  = {}; // names of files we've moved previously

        while (remaining.length > 0) {
            var first = remaining[0];
            var missing = findMissing(first, copied);
            if (!missing) {
                copied[first.file.relative] = 1;
                result.push(first);
                remaining.splice(0, 1);
                delete moved[first.file.relative];
            } else {
                // We are missing a dependency.  Find the dependency and move it to the front.
                if (moved[missing])
                    throw new Error('Cyclic dependency: ' + missing + ', ' + first.file.relative);

                if (!moveToFront(missing, remaining))
                    throw new Error(first.file.relative + ' requires ' + missing + ' which was not found');

                moved[missing] = 1;
            }
        }

        return result.map(function(e) { return e.file; });
    }

    function moveToFront(name, remaining) {
        // Finds the entry with name `name` and moves it to the front.  Returns true if found, false otherwise.
        for (var i = 0, c = remaining.length; i < c; i++) {
            var e = remaining[i];
            if (e.file.relative === name) {
                remaining.splice(i, 1);
                remaining.splice(0, 0, e);
                return true;
            }
        }
        return false;
    }

    function findMissing(entry, copied) {
        // Returns the first dependency in `entry.requires` that is not already in `copied`.
        // Returns null otherwise.
        for (var i = 0; i < entry.requires.length; i++) {
            if (!copied[entry.requires[i]])
                return entry.requires[i];
        }

        return null;
    }

    return through(gather, complete);
};
