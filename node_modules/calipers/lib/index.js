'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var popen   = Promise.promisify(fs.open);
var pclose  = Promise.promisify(fs.close);
var detect  = require('./detect');

function measure (plugins, path, callback) {
  return popen(path, 'r')
  .bind({})
  .then(function (fd) {
    this.fd = fd;
    return detect(fd, plugins);
  })
  .then(function (plugin) {
    return plugin.measure(path, this.fd);
  })
  .finally(function () {
    return pclose(this.fd);
  })
  .asCallback(callback);
}

module.exports = function () {
  var args = Array.prototype.slice.call(arguments);

  var plugins = args.map(function (arg) {
    if (typeof arg === 'object') {
      return arg;
    } else {
      return require('calipers-' + arg);
    }
  });

  return {
    measure: measure.bind(null, plugins)
  };
};
