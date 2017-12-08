'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pread   = Promise.promisify(fs.read, { multiArgs: true });
var utils   = require('./utils');

function measureLossy (buffer) {
  return {
    type: 'webp',
    pages: [{
      width: buffer.readInt16LE(6) & 0x3fff,
      height: buffer.readInt16LE(8) & 0x3fff
    }]
  };
}

function measureLossless (buffer) {
  return {
    type: 'webp',
    pages: [{
      width: 1 + ((buffer[2] & 0x3f) << 8 | buffer[1]),
      height: 1 + ((buffer[4] & 0xf) << 10 | buffer[3] << 2 | (buffer[2] & 0xc0) >> 6)
    }]
  };
}

exports.detect = function (buffer) {
  return utils.ascii(buffer, 0, 4) === 'RIFF' && utils.ascii(buffer, 8, 12) === 'WEBP';
};

exports.measure = function (path, fd) {
  return pread(fd, new Buffer(30), 0, 30, 0)
  .spread(function (bytesRead, buffer) {
    var chunkHeader = buffer.toString('ascii', 12, 16);
    buffer = buffer.slice(20);

    if (chunkHeader === 'VP8 ') {
      return measureLossy(buffer);
    }

    if (chunkHeader === 'VP8L') {
      return measureLossless(buffer);
    }

    return Promise.reject(new Error('Invalid WEBP file'));
  });
};
