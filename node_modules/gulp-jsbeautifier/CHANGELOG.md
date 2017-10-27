# Changelog

## 2.1.1 - 2017-06-11
- Update dependencies
- Correct documentation ([#29](https://github.com/tarunc/gulp-jsbeautifier/issues/29))

## 2.1.0 - 2017-03-08
- Add validate function
- Add `verbosity` option for reporter
- Update copyright

## 2.0.4 - 2016-12-30
- Update dependencies

## 2.0.3 - 2016-04-03
- Improve documentation
- Run lint before tests
- Keep unnecessary files outside of the package

## 2.0.2 - 2016-03-03
- Add tests for `debug` option
- Fix some errors that could occur with the reporter

## 2.0.1 - 2016-03-02
- Code refactoring
- Improve tests
- Fix an issue with file path ([#22](https://github.com/tarunc/gulp-jsbeautifier/issues/22), [#23](https://github.com/tarunc/gulp-jsbeautifier/issues/23))

## 2.0.0 - 2016-03-01
- Total rewrite of gulp-jsbeautifier
- Improve documentation
- Improve tests
- Add a reporter (replace `showDiff` option)
- Add `debug` option
- Remove `mode` and `showDiff` options (use `gulp-diff` package instead)
- Change logic of merging options
- Use 'snake_case' instead of 'camelCase' for options (for consistency with `js-beautify`)

## 1.0.2 - 2016-02-11
- Added different color to the logs
- Upgraded dependencies

## 1.0.1 - 2015-07-11
- Added `showDiff` option
- Upgrade `jsbeautifier` package

## 1.0.0 - 2015-06-19
- Pushed out `1.0.0` release

## 0.0.8 - 2015-03-23
- Fixed and added tests for `logSuccess` option

## 0.0.7 - 2015-03-19
- Fixed option parsing to accept raw options

## 0.0.6 - 2015-03-11
- Added `logSuccess` option

## 0.0.5 - 2015-03-06
- Print out diff through `ansidiff`

## 0.0.4 - 2014-11-20
- Allow for other versions of `jsbeautifier`

## 0.0.3 - 2014-10-01
- Upgrade `jsbeautifier` package

## 0.0.2 - 2014-05-01
- Added option to set `config: true` to default '.jsbeautifyrc'

## 0.0.1 - 2014-04-30
- Initial release
