'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reporterFactory;

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _stylelint = require('stylelint');

var _writer = require('./writer');

var _writer2 = _interopRequireDefault(_writer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a reporter from the given config.
 * @param {Object} [config] - Reporter config.
 * @param {Object} [options] - Plugin options.
 * @return {Function} Reporter.
 */
function reporterFactory() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  /**
   * Formatter for stylelint results.
   *
   * User has a choice of passing a custom formatter function,
   * or a name of formatter bundled with stylelint by default.
   *
   * @type {Function}
   */
  var formatter = typeof config.formatter === 'string' ? _stylelint.formatters[config.formatter] : config.formatter;

  /**
   * Reporter.
   * @param {[Object]} results - Array of stylelint results.
   * @return {Promise} Resolved when writer and logger are done.
   */
  return function reporter(results) {

    /**
     * Async tasks performed by the reporter.
     * @type [Promise]
     */
    var asyncTasks = [];

    /**
     * Formatter output.
     * @type String
     */
    var formattedText = formatter(results);

    if (config.console && formattedText.trim()) {
      asyncTasks.push(_gulpUtil2.default.log('\n' + formattedText + '\n'));
    }

    if (config.save) {
      asyncTasks.push((0, _writer2.default)(formattedText, config.save, options.reportOutputDir));
    }

    return Promise.all(asyncTasks);
  };
} /**
   * Gulp stylelint reporter factory.
   * @module gulp-stylelint/reporter-factory
   */