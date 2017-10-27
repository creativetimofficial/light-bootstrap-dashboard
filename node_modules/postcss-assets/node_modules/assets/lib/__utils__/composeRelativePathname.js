var convertPathToUrl = require('./convertPathToUrl');
var path = require('path');

module.exports = function (basePath, relativeTo, resolvedPath) {
  var from = path.resolve(basePath, relativeTo);
  var relativePath = path.relative(from, resolvedPath);
  return convertPathToUrl(relativePath);
};
