/* eslint quotes: 0 */

var util = require('util');

var R_QUOTES = /'/g;

function escapeQuote(match, offset, string) {
  if (string[offset - 1] === '\\') {
    return match;
  }
  return '\\' + match;
}

module.exports = function quote(string) {
  if (string[0] === "'" || string[0] === '"') {
    return string;
  }
  return util.format("'%s'", string.replace(R_QUOTES, escapeQuote));
};
