var calipers = require('calipers')('webp', 'png', 'jpeg', 'gif', 'svg');
var Promise = require('bluebird');
var resolvePath = require('./path');

module.exports = function (to, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  return resolvePath(to, options)
    .then(function (resolvedPath) {
      return calipers.measure(resolvedPath)
        .then(function (result) {
          return result.pages[0];
        })
        .catch(function (err) {
          return Promise.reject(new Error(err.message + ': ' + resolvedPath));
        });
    })
    .nodeify(callback);
};
