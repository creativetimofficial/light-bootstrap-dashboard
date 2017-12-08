'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read, { multiArgs: true });
var utils   = require('./utils');

exports.detect = function (buffer) {
  return utils.ascii(buffer, 1, 8) === 'PNG\r\n\x1a\n' && utils.ascii(buffer, 12, 16) === 'IHDR';
};

exports.measure = function (path, fd) {
  return pread(fd, new Buffer(8), 0, 8, 16)
  .spread(function (bytesRead, buffer) {
    return {
      type: 'png',
      pages: [{
        width: buffer.readUInt32BE(0),
        height: buffer.readUInt32BE(4)
      }]
    };
  });
};
