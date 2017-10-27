var deporder = require('../');
var path = require('path');
var File = require('gulp-util').File;
var assert = require('assert');
require('mocha');

describe('gulp-deporder', function() {
    describe('deporder()', function() {
        it('should be stable', function(done) {
            generateTest({
                before: [
                    'arkstream.js',
                    'blackpearl.js',
                    'chimneypool.js'
                ],
                expected: [
                    'arkstream.js',
                    'blackpearl.js',
                    'chimneypool.js'
                ],
                onEnd: function() {
                    assert.deepEqual(this.test.result, this.test.expected);
                    done();
                }
            });
        });

        it('should reorder - inline without colon', function(done) {
            generateTest({
                before: [
                    'arkstream.js  --> chimneypool.js blackpearl.js',
                    'blackpearl.js --> chimneypool.js',
                    'chimneypool.js'
                ],
                expected: [
                    'chimneypool.js',
                    'blackpearl.js',
                    'arkstream.js'
                ],
                onEnd: function() {
                    assert.deepEqual(this.test.result, this.test.expected);
                    done();
                }
            });
        });

        it('should reorder - inline with colon', function(done) {
            generateTest({
                module: {
                    colon: true
                },
                before: [
                    'arkstream.js  --> chimneypool.js blackpearl.js',
                    'blackpearl.js --> chimneypool.js',
                    'chimneypool.js'
                ],
                expected: [
                    'chimneypool.js',
                    'blackpearl.js',
                    'arkstream.js'
                ],
                onEnd: function() {
                    assert.deepEqual(this.test.result, this.test.expected);
                    done();
                }
            });
        });

        it('should reorder - multiline without colon', function(done) {
            generateTest({
                module: {
                    multiline: true
                },
                before: [
                    'arkstream.js  --> chimneypool.js blackpearl.js',
                    'blackpearl.js --> chimneypool.js',
                    'chimneypool.js'
                ],
                expected: [
                    'chimneypool.js',
                    'blackpearl.js',
                    'arkstream.js'
                ],
                onEnd: function() {
                    assert.deepEqual(this.test.result, this.test.expected);
                    done();
                }
            });
        });

        it('should reorder - multiline with colon', function(done) {
            generateTest({
                module: {
                    multiline: true,
                    colon: true
                },
                before: [
                    'arkstream.js  --> chimneypool.js blackpearl.js',
                    'blackpearl.js --> chimneypool.js',
                    'chimneypool.js'
                ],
                expected: [
                    'chimneypool.js',
                    'blackpearl.js',
                    'arkstream.js'
                ],
                onEnd: function() {
                    assert.deepEqual(this.test.result, this.test.expected);
                    done();
                }
            });
        });

        it('should report errors', function(done) {
            generateTest({
                before: [
                    'arkstream.js  --> chimneypool.js blackpearl.js',
                    'blackpearl.js --> danderspritz.js',
                    'chimneypool.js'
                ],
                onError: function(e) {
                    done();
                }
            });
        });
    });

    function generateTest(options)
    {
        var stream = deporder();
        var before = options.before.map(makeFile, options.module);
        var result = [];

        stream.on('data', function(file) {
            result.push(file.relative);
        });

        stream.test = {
            result: result,
            expected: options.expected
        };

        if (options.onError) {
            stream.on('error', options.onError);
        }

        if (options.onEnd) {
            stream.on('end', options.onEnd);
        }

        before.forEach(stream.write);
        stream.end();
    }

    function makeFile(spec, options) {
        var filename;
        var dir = '/mkultra';
        var contents = 'Hello, Sailor!';

        var match = /^(\S+)\s+-->\s+(.*)$/.exec(spec);
        if (match) {
            filename = match[1];
            contents = generateRequires(match[2].split(' '), options) + '\n' + contents;
        } else {
            filename = spec;
        }

        return new File({
            cwd:  dir,
            base: dir,
            path: path.join(dir, filename),
            contents: new Buffer(contents)
        });
    }

    function generateRequires(dependencies, options)
    {
        options = options || {};

        var content = 'requires';
        if (options.colon) {
            content += ':';
        }

        if (options.multiline) {
            content = '/* \n' + content + '\n ' + dependencies.join('\n ') + '\n*/';
        } else {
            content = '// ' + content + ' ' + dependencies.join(' ');
        }

        return content;
    }
});
