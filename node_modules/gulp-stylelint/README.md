# gulp-stylelint

[![NPM version](http://img.shields.io/npm/v/gulp-stylelint.svg)](https://www.npmjs.org/package/gulp-stylelint)
[![Build Status](https://travis-ci.org/olegskl/gulp-stylelint.svg?branch=master)](https://travis-ci.org/olegskl/gulp-stylelint)
[![Dependency Status](https://david-dm.org/olegskl/gulp-stylelint.svg)](https://david-dm.org/olegskl/gulp-stylelint)
[![Join the chat at https://gitter.im/olegskl/gulp-stylelint](https://badges.gitter.im/olegskl/gulp-stylelint.svg)](https://gitter.im/olegskl/gulp-stylelint?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A [Gulp](http://gulpjs.com/) plugin that runs [stylelint](https://github.com/stylelint/stylelint) results through a list of reporters.

## Installation

```bash
npm install gulp-stylelint --save-dev
```

## Quick start

Once you have [configured stylelint](http://stylelint.io/user-guide/configuration/) (e.g. you have a *.stylelintrc* file), start with the following code. You will find additional configuration [options](#options) below.

```js
const gulp = require('gulp');

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});
```

## Formatters

Below is the list of currently available stylelint formatters. Some of them are bundled with stylelint by default and exposed on `gulpStylelint.formatters` object. Others need to be installed. You can [write a custom formatter](http://stylelint.io/developer-guide/formatters/) to tailor the reporting to your needs.

 - `"string"` (same as `gulpStylelint.formatters.string`) – bundled with stylelint
 - `"verbose"` (same as `gulpStylelint.formatters.verbose`) – bundled with stylelint
 - `"json"` (same as `gulpStylelint.formatters.json`) – bundled with stylelint
 -  [stylelint-checkstyle-formatter](https://github.com/davidtheclark/stylelint-checkstyle-formatter) – requires installation

## Options

gulp-stylelint supports all [stylelint options](http://stylelint.io/user-guide/node-api/#options) except [`files`](http://stylelint.io/user-guide/node-api/#files) and [`formatter`](http://stylelint.io/user-guide/node-api/#formatter) and accepts a custom set of options listed below:

```js
const gulp = require('gulp');

gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');
  const myStylelintFormatter = require('my-stylelint-formatter');

  return gulp
    .src('src/**/*.css')
    .pipe(gulpStylelint({
      failAfterError: true,
      reportOutputDir: 'reports/lint',
      reporters: [
        {formatter: 'verbose', console: true},
        {formatter: 'json', save: 'report.json'},
        {formatter: myStylelintFormatter, save: 'my-custom-report.txt'}
      ],
      debug: true
    }));
});
```

#### `failAfterError`

When set to `true`, the process will end with non-zero error code if any error-level warnings were raised. Defaults to `true`.

#### `reportOutputDir`

Base directory for lint results written to filesystem. Defaults to current working directory.

#### `reporters`

List of reporter configuration objects (see below). Defaults to an empty array.

```js
{
  // stylelint results formatter (required):
  // - pass a function for imported, custom or exposed formatters
  // - pass a string ("string", "verbose", "json") for formatters bundled with stylelint
  formatter: myFormatter,

  // save the formatted result to a file (optional):
  save: 'text-report.txt',

  // log the formatted result to console (optional):
  console: true
}
```

#### `debug`

When set to `true`, the error handler will print an error stack trace. Defaults to `false`.

## License

[MIT License](http://opensource.org/licenses/MIT)
