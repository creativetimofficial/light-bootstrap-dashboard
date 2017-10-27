var convertPathToUrl = require('./convertPathToUrl');
var path = require('path');
var url = require('url');

module.exports = function (urlStr) {
  var urlObj = url.parse(urlStr);
  urlObj.pathname = convertPathToUrl(path.join(urlObj.pathname, path.sep));
  return url.format(urlObj);
};
