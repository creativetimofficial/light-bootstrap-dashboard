'use strict';

// Converts part of a buffer to an ASCII string.
exports.ascii = function (buffer, start, end) {
  return buffer.toString('ascii', start, end);
};
