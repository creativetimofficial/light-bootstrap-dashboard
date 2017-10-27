'use strict';

// Converts part of a buffer to an ASCII string.
exports.ascii = function (buffer, start, end) {
  return buffer.toString('ascii', start, end);
};

// Detects encoding of a buffer
exports.detectEncoding = function (buffer) {
  for (var i = 0; i < buffer.length; i++) {
    if (buffer[i] === 65533 || buffer[i] <= 8) {
      return 'binary';
    }
  }
  return 'utf8';
};
