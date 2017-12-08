'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read, { multiArgs: true });

exports.detect = function (buffer) {
  return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
}

exports.measure = function (path, fd) {
  return pread(fd, new Buffer(8), 0, 4, 6)
  .spread(function (bytesRead, buffer) {
    return {
      type: 'gif',
      pages: [{
        width: buffer.readUInt16LE(0),
        height: buffer.readUInt16LE(2)
      }]
    };
  });
}
