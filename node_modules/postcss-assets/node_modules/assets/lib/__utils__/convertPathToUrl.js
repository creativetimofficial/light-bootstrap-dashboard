var sep = require('path').sep;

module.exports = function (path) {
  return path.split(sep).join('/');
};
