var fs = require('fs');

module.exports = function (filePath, callback) {
  fs.stat(filePath, function (err) {
    callback(err === null);
  });
};
