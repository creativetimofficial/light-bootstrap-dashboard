'use strict';
var exec = require('child_process').exec;
var chalk = require('chalk');
var npmRunPath = require('npm-run-path');
var objectAssign = require('object-assign');

module.exports = function (grunt) {
	grunt.registerMultiTask('shell', 'Run shell commands', function () {
		var cb = this.async();
		var opts = this.options({
			stdout: true,
			stderr: true,
			stdin: true,
			failOnError: true,
			stdinRawMode: false,
			preferLocal: false,
			execOptions: {
				env: null
			}
		});

		var cmd = typeof this.data === 'string' ? this.data : this.data.command;

		if (cmd === undefined) {
			throw new Error('`command` required');
		}

		cmd = grunt.template.process(typeof cmd === 'function' ? cmd.apply(grunt, arguments) : cmd);

		if (opts.preferLocal === true) {
			opts.execOptions.env = opts.execOptions.env || objectAssign({}, process.env);
			opts.execOptions.env.PATH = npmRunPath({path: opts.execOptions.env.PATH});
		}

		var cp = exec(cmd, opts.execOptions, function (err, stdout, stderr) {
			if (typeof opts.callback === 'function') {
				opts.callback.call(this, err, stdout, stderr, cb);
			} else {
				if (err && opts.failOnError) {
					grunt.warn(err);
				}
				cb();
			}
		}.bind(this));

		var captureOutput = function (child, output) {
			if (grunt.option('color') === false) {
				child.on('data', function (data) {
					output.write(chalk.stripColor(data));
				});
			} else {
				child.pipe(output);
			}
		};

		grunt.verbose.writeln('Command:', chalk.yellow(cmd));

		if (opts.stdout || grunt.option('verbose')) {
			captureOutput(cp.stdout, process.stdout);
		}

		if (opts.stderr || grunt.option('verbose')) {
			captureOutput(cp.stderr, process.stderr);
		}

		if (opts.stdin) {
			process.stdin.resume();
			process.stdin.setEncoding('utf8');

			if (opts.stdinRawMode && process.stdin.isTTY) {
				process.stdin.setRawMode(true);
			}

			process.stdin.pipe(cp.stdin);
		}
	});
};
