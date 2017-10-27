var R_ESCAPE = /\\(?:([0-9a-f]{1,6} ?)|(.))/gi;

function unescapeSequence(match, hex, char) {
  if (hex) {
    return String.fromCharCode(parseInt(hex, 16));
  }
  return char;
}

module.exports = function unescapeCss(string) {
  return string.replace(R_ESCAPE, unescapeSequence);
};
