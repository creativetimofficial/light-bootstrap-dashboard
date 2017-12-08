module.exports = function (current, addon) {
  if (current) {
    return current + '&' + addon;
  }
  return '?' + addon;
};
