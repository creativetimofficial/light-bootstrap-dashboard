# gulp-jsbeautifier
[![Build Status](https://travis-ci.org/tarunc/gulp-jsbeautifier.svg?branch=master)](https://travis-ci.org/tarunc/gulp-jsbeautifier)
[![npm version](https://badge.fury.io/js/gulp-jsbeautifier.svg)](https://badge.fury.io/js/gulp-jsbeautifier)
[![Coverage Status](https://coveralls.io/repos/github/tarunc/gulp-jsbeautifier/badge.svg?branch=master)](https://coveralls.io/github/tarunc/gulp-jsbeautifier?branch=master)
[![Code Climate](https://codeclimate.com/github/tarunc/gulp-jsbeautifier/badges/gpa.svg)](https://codeclimate.com/github/tarunc/gulp-jsbeautifier)
[![Dependency Status](https://david-dm.org/tarunc/gulp-jsbeautifier.svg)](https://david-dm.org/tarunc/gulp-jsbeautifier)
[![devDependency Status](https://david-dm.org/tarunc/gulp-jsbeautifier/dev-status.svg)](https://david-dm.org/tarunc/gulp-jsbeautifier#info=devDependencies)

> Prettify JavaScript, JSON, HTML and CSS.  
[jsbeautifier.org](http://jsbeautifier.org/) for gulp.

## Install
```sh
npm install --save-dev gulp-jsbeautifier
```

## Basic Usage
```javascript
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('prettify', function() {
  gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify())
    .pipe(gulp.dest('./dist'));
});
```

## Options
All options are optional.

### Plugin options
#### `css`, `html`, `js`
Type: `Object`  
Default value: `{ file_types: [...] }`

Contains specific "[beautifier options](#beautifier-options)"  for CSS, HTML and JavaScript.

* **`file_types`**  
  Type: `Array`  
  Default value for `css`: `['.css', '.less', '.sass', '.scss']`  
  Default value for `html`: `['.html']`  
  Default value for `js`: `['.js', '.json']`

  Specifies which files should be treated as CSS, HTML or JavaScript.

```javascript
// Specifies that ONLY '*.js' and '.bowerrc' files should be treated as JavaScript.
gulp.task('prettify', function() {
  gulp.src(['./*.js', './*.json', './.bowerrc'])
    .pipe(prettify({
      js: {
        file_types: ['.js', '.bowerrc']
      }
    }))
    .pipe(gulp.dest('./'));
});
```

#### `config`
Type: `String`  
Default value: `null`

If a file is specified, the options defined in it will be loaded.  
Otherwise, gulp-jsbeautifier will looking for a `.jsbeautifyrc` file in [this places](https://www.npmjs.com/package/rc#standards) and if found, load its options.

The file specified and the `.jsbeautifyrc` file must be a valid JSON and can contain all the options of this documentation except `config` and `debug`.

```javascript
// Use options specified in './config/jsbeautify.json'.
gulp.task('prettify', function() {
  gulp.src('./*.js')
    .pipe(prettify({
      config: './config/jsbeautify.json'
    }))
    .pipe(gulp.dest('./dist'));
});

// Looking for a '.jsbeautifyrc' file and if found, use its options.
gulp.task('prettify', function() {
  gulp.src('./*.js')
    .pipe(prettify())
    .pipe(gulp.dest('./dist'));
});
```

#### `debug`
Type: `Boolean`  
Default value: `false`

If `false` shows no debug messages.   
If `true` shows useful debug messages.   
If you have difficulty, try setting this to `true` and use the [reporter](#reporter).

```javascript
// Shows debug messages.
gulp.task('prettify', function() {
  gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify({
      debug: true
    }))
    .pipe(gulp.dest('./dist'));
});
```

### Beautifier options
The "beautifier options" are the same underscored options used by js-beautify.  
See the [js-beautify docs](https://github.com/beautify-web/js-beautify) for a list of them.

All "beautifier options" placed in the root, are applied to CSS, HTML and JavaScript, unless there are no specific ones.

```javascript
// The indentation is 4 for CSS and HTML instead is 2 for JavaScript.
gulp.task('prettify', function() {
  gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify({
      indent_size: 4,
      js: {
        indent_size: 2
      }
    }))
    .pipe(gulp.dest('./dist'));
});
```

The options given through parameters in gulp are merged with those given through files.  
The merge order is: default values, configuration file, parameters.  
Subsequent options overwrite the previous ones.

```javascript
// 'config.json'
// 4 spaces indentation for CSS and HTML.
// 2 spaces indentation for JavaScript.
{
  "indent_size": 4,
  "indent_char": ' ',
  // other options
  "js": {
    // other options
    "indent_size": 2
  }
}

// Overwrite the indentation specified in 'config.json' with
// one tab indentation for all CSS, HTML and JavaScript.
// All other options in 'config.json' are maintained.
gulp.task('prettify', function() {
  gulp.src('./*.css', './*.html', './*.js')
    .pipe(prettify({
      config: './config.json',
      indent_char: '\t',
      indent_size: 1
    }))
    .pipe(gulp.dest('./'));
});
```

## Validate
Checks if it is possible to beautify some files.
The reporter is responsible for displaying the validate results and will emit an error before
the stream ends if a file could be beautified.

```javascript
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('validate', function() {
  return gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify.validate())
    .pipe(prettify.reporter())
});
```

## Reporter
Lists files that have been beautified, those already beautified, and those that can not be beautified.  
If the [validate](#validate) feature is used, the reporter lists files that can be beautified and emits an error before the stream ends if such a file was detected.

```javascript
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('prettify', function() {
  gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify())
    .pipe(prettify.reporter())
    .pipe(gulp.dest('./'));
});
```

### Reporter options
#### `verbosity`
Type: `number`  
Default value: `prettify.report.BEAUTIFIED`  
Other values: `prettify.report.ALL`

With BEAUTIFIED value, the reporter lists only beautified files (or those that can be beautified in the case of validate).  
With ALL value, the reporter also lists the other files.

```javascript
var gulp = require('gulp');
var prettify = require('gulp-jsbeautifier');

gulp.task('prettify', function() {
  gulp.src(['./*.css', './*.html', './*.js'])
    .pipe(prettify())
    .pipe(prettify.reporter({
      verbosity: prettify.report.ALL
    }))
    .pipe(gulp.dest('./'));
});
```

## License
`gulp-jsbeautifier` is released under the [MIT License](./LICENSE.md).
