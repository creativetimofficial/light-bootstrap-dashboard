var encodeBuffer = require('./__utils__/encodeBuffer');
var extend = require('lodash/object/extend');
var fs = require('fs');
var mime = require('mime');
var Promise = require('bluebird');
var resolvePath = require('./path');
var url = require('url');

var preadFile = Promise.promisify(fs.readFile);

module.exports = function (to, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = extend({
    basePath: '.',
    loadPaths: []
  }, options);

  var toUrl = url.parse(to);

  return resolvePath(toUrl.pathname, options)
    .then(function (resolvedPath) {
      var mediaType = mime.lookup(resolvedPath);
      return preadFile(resolvedPath)
        .then(function (buffer) {
          var data = encodeBuffer(buffer, mediaType);
          return 'data:' + mediaType + ';' + data + (toUrl.hash || '');
        });
    })
    .nodeify(callback);
};
