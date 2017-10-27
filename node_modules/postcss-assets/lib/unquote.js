module.exports = function unquote(string) {
  if (string[0] !== '\'' && string[0] !== '"') {
    return string;
  }
  return string.slice(1, -1);
};
