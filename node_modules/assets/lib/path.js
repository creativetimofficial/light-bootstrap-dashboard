var async = require('async');
var exists = require('./__utils__/exists');
var extend = require('lodash/object/extend');
var flatten = require('lodash/array/flatten');
var glob = require('glob');
var path = require('path');
var Promise = require('bluebird');

var pglob = Promise.promisify(glob);

module.exports = function (to, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend({
    basePath: '.',
    loadPaths: []
  }, options);

  var loadPaths = [].concat(options.loadPaths);

  return Promise.map(loadPaths, function (loadPath) {
    return pglob(loadPath, {
      cwd: options.basePath
    })
      .then(function (matchedPaths) {
        return matchedPaths.map(function (matchedPath) {
          return path.resolve(options.basePath, matchedPath, to);
        });
      });
  })
    .then(function (filePaths) {
      filePaths = flatten(filePaths);
      filePaths.unshift(path.resolve(options.basePath, to));

      return new Promise(function (resolve, reject) {
        async.detectSeries(filePaths, exists, function (resolvedPath) {
          if (resolvedPath) return resolve(resolvedPath);
          reject(new Error('Asset not found or unreadable: ' + to));
        });
      });
    })
    .nodeify(callback);
};
