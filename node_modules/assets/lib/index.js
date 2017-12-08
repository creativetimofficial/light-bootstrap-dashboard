var extend = require('lodash/object/extend');

function Assets(options) {
  if (!(this instanceof Assets)) {
    return new Assets(options);
  }

  this.options = extend({}, options);
  Object.freeze(this);
}

['data', 'path', 'size', 'url'].forEach(function (resolver) {
  Assets[resolver] = require('./' + resolver);
  Assets.prototype[resolver] = function (path, callback) {
    return Assets[resolver](path, this.options, callback);
  };
});

module.exports = Assets;
