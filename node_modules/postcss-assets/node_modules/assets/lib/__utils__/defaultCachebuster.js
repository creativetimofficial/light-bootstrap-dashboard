var fs = require('fs');

module.exports = function (resolvedPath) {
  var mtime = fs.statSync(resolvedPath).mtime;
  return mtime.getTime().toString(16);
};
