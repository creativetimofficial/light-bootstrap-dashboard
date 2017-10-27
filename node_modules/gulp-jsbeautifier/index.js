'use strict';

var _ = require('lodash');
var beautify = require('js-beautify');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var rc = require('rc');
var through = require('through2');
var log = gutil.log;
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-jsbeautifier';

/**
 * Show debug messages
 * @param  {string} string The message
 * @param  {boolean} show  Specifies whether the message should be displayed or not
 * @return {void}
 */
function debug(string, show) {
  if (show === true) {
    log(string);
  }
}

/**
 * Reorganize the options to use them in js-beautify
 * @param  {Object} options The options to reorganize
 * @return {Object} The options reorganized
 */
function setup(options) {
  var cfg = {
    defaults: {
      config: null,
      debug: false,
      css: {
        file_types: ['.css', '.less', '.sass', '.scss']
      },
      html: {
        file_types: ['.html']
      },
      js: {
        file_types: ['.js', '.json']
      }
    },
    file: {},
    params: {},
    final: {}
  };

  // Load 'parameters options'
  _.assign(cfg.params, options);

  // Load 'file options'
  if (cfg.params.config) {
    // Load the configuration file.
    _.assign(cfg.file, JSON.parse(fs.readFileSync(path.resolve(cfg.params.config))));

    debug('Configuration file loaded: ' + JSON.stringify(cfg.params.config), cfg.params.debug);
  } else {
    // Search and load the '.jsbeautifyrc' file
    rc('jsbeautify', cfg.file);

    if (cfg.file.configs) {
      debug('Configuration files loaded:\n' + JSON.stringify(cfg.file.configs, null, 2), cfg.params.debug);
    }

    // Delete properties added by 'rc'
    delete cfg.file._;
    delete cfg.file.configs;
  }

  // Delete properties not used
  delete cfg.file.debug;
  delete cfg.file.config;

  // Merge 'plugin options'
  _.assign(cfg.final, cfg.defaults, cfg.file, cfg.params);

  // Merge 'beautifier options'
  ['css', 'html', 'js'].forEach(function (type) {
    cfg.final[type] = _.assign({}, cfg.defaults[type], cfg.file, cfg.file[type], cfg.params, cfg.params[type]);
  });

  // Delete 'plugin options' from 'beautifier options'
  ['css', 'html', 'js'].forEach(function (type) {
    _.keys(cfg.defaults).forEach(function (property) {
      delete cfg.final[type][property];
    });
  });

  // Delete 'beautifier options' from 'plugin options'
  _.keys(cfg.final).forEach(function (property) {
    if (!Object.prototype.hasOwnProperty.call(cfg.defaults, property)) {
      delete cfg.final[property];
    }
  });

  debug('Configuration used:\n' + JSON.stringify(cfg.final, null, 2), cfg.params.debug);

  return cfg.final;
}

/**
 * Beautify files or perform validation
 * @param  {Object} options The gulp-jsbeautifier options
 * @param  {boolean} doValidation Specifies whether only perform validation
 * @return {Object} The object stream
 */
function helper(options, doValidation) {
  var config = setup(options);

  return through.obj(function (file, encoding, callback) {
    var oldContent;
    var newContent;
    var type = null;

    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    // Check if current file should be treated as JavaScript, HTML, CSS or if it should be ignored
    ['js', 'css', 'html'].some(function (value) {
      // Check if at least one element in 'file_types' is suffix of file basename
      if (config[value].file_types.some(function (suffix) {
        return _.endsWith(path.basename(file.path), suffix);
      })) {
        type = value;
        return true;
      }

      return false;
    });

    // Initialize properties for reporter
    file.jsbeautify = {};
    file.jsbeautify.type = type;
    file.jsbeautify.beautified = false;
    file.jsbeautify.canBeautify = false;

    if (type) {
      oldContent = file.contents.toString('utf8');
      newContent = beautify[type](oldContent, config[type]);

      if (oldContent.toString() !== newContent.toString()) {
        if (doValidation) {
          file.jsbeautify.canBeautify = true;
        } else {
          file.contents = new Buffer(newContent);
          file.jsbeautify.beautified = true;
        }
      }
    }

    callback(null, file);
  });
}

/**
 * Perform the validation of files without changing their content
 * @param  {Object} options The gulp-jsbeautifier options
 * @return {Object} The object stream
 */
function validate(options) {
  return helper(options, true);
}

/**
 * Beautify files
 * @param  {Object} options The gulp-jsbeautifier options
 * @return {Object} The object stream with beautified files
 */
function prettify(options) {
  return helper(options, false);
}

/**
 * Show results of beautification or validation
 * @param  {Object} options The gulp-jsbeautifier reporter options
 * @return {Object} The object stream
 */
function reporter(options) {
  var verbosity = 0;
  var errorCount = 0;

  if (typeof options === 'object' && Object.prototype.hasOwnProperty.call(options, 'verbosity')) {
    verbosity = options.verbosity;
  }

  return through.obj(function (file, encoding, callback) {
    if (file.jsbeautify) {
      if (verbosity >= 1 && file.jsbeautify.type === null) {
        log('Can not beautify ' + gutil.colors.cyan(file.relative));
      } else if (verbosity >= 0 && file.jsbeautify.beautified) {
        log('Beautified ' + gutil.colors.cyan(file.relative) + ' [' + file.jsbeautify.type + ']');
      } else if (verbosity >= 0 && file.jsbeautify.canBeautify) {
        errorCount += 1;
        log('Can beautify ' + gutil.colors.cyan(file.relative) + ' [' + file.jsbeautify.type + ']');
      } else if (verbosity >= 1) {
        log('Already beautified ' + gutil.colors.cyan(file.relative) + ' [' + file.jsbeautify.type + ']');
      }
    }

    callback(null, file);
  }, function flush(callback) {
    if (errorCount > 0) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Validation not passed. Please beautify.'));
    }
    callback();
  });
}

// Exporting the plugin functions
module.exports = prettify;
module.exports.validate = validate;
module.exports.reporter = reporter;
module.exports.report = {
  BEAUTIFIED: 0,
  ALL: 1
};
