'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read, { multiArgs: true });

var DETECT_LENGTH = 16;

//Determines the appropriate plugin to use for the given file descriptor.
module.exports = function (fd, plugins) {
  return pread(fd, new Buffer(DETECT_LENGTH), 0, DETECT_LENGTH, 0)
  .spread(function (bytesRead, buffer) {
    for (var i = 0; i < plugins.length; i++) {
      var plugin = plugins[i];
      if (plugin.detect(buffer)) {
        return plugin;
      }
    }
    throw new Error('File type not supported');
  });
};
