'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pfstat  = Promise.promisify(fs.fstat);
var pread   = Promise.promisify(fs.read, { multiArgs: true });

var BUFFER_SIZE = 9;
var SIZE_POS    = 2;
var HEIGHT_POS  = 5;
var WIDTH_POS   = 7;
var SOFs = [
  0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
  0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF
];

exports.detect = function (buffer) {
  return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
};

function findSOF (fd, buffer, size, offset) {

  if (offset >= size || (buffer && buffer[0] !== 0xFF)) {
    return Promise.reject(new Error('Invalid JPEG file'));
  }

  if (!buffer || SOFs.indexOf(buffer[1]) === -1) {
    var newOffset = buffer ?
      offset + buffer.readUInt16BE(SIZE_POS) + SIZE_POS :
      SIZE_POS;
    buffer = buffer ? buffer : new Buffer(BUFFER_SIZE);
    return pread(fd, buffer, 0, BUFFER_SIZE, newOffset)
    .spread(function (bytesRead, newBuffer) {
      return findSOF(fd, newBuffer, size, newOffset);
    });
  }

  return Promise.resolve(buffer);
}

exports.measure = function (path, fd) {
  return pfstat(fd)
  .then(function (stat) {
    return findSOF(fd, null, stat.size, 0);
  })
  .then(function (frameBuffer) {
    return {
      type: 'jpeg',
      pages: [{
        height: frameBuffer.readUInt16BE(HEIGHT_POS),
        width: frameBuffer.readUInt16BE(WIDTH_POS)
      }]
    };
  });
};
