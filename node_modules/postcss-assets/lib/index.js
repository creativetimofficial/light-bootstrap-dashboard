var Assets = require('assets');
var dirname = require('path').dirname;
var functions = require('postcss-functions');
var postcss = require('postcss');
var quote = require('./quote');
var unescapeCss = require('./unescape-css');
var unquote = require('./unquote');
var util = require('util');
var Promise = require('bluebird');
var generateFileUniqueId = require('./__utils__/generateFileUniqueId');

var cachedDimensions = {};

function formatUrl(url) {
  return util.format('url(%s)', quote(url));
}

function formatSize(measurements) {
  return util.format('%dpx %dpx', measurements.width, measurements.height);
}

function formatWidth(measurements) {
  return util.format('%dpx', measurements.width);
}

function formatHeight(measurements) {
  return util.format('%dpx', measurements.height);
}

function plugin(options) {
  var params = options || {};
  var resolver;

  if (params.relative === undefined) {
    params.relative = false;
  }

  resolver = new Assets(options);

  function measure(path, density) {
    var cached = null;
    var id = '';
    var getSizePromise = null;

    return resolver.path(path).then(function measureSize(resolvedPath) {
      if (params.cache) {
        cached = cachedDimensions[resolvedPath];
        id = generateFileUniqueId(resolvedPath);
      }

      if (cached && id && cached[id]) {
        getSizePromise = Promise.resolve(cached[id]);
      } else {
        getSizePromise = resolver.size(path).then(function cacheSize(size) {
          if (params.cache && id) {
            cachedDimensions[resolvedPath] = {};
            cachedDimensions[resolvedPath][id] = size;
          }
          return size;
        });
      }

      return getSizePromise.then(function correctDensity(size) {
        if (density !== undefined) {
          return {
            width: Number((size.width / density).toFixed(4)),
            height: Number((size.height / density).toFixed(4))
          };
        }
        return size;
      });
    });
  }

  return postcss()
    .use(function appendInputDir(css) {
      var inputDir;

      if (css.source.input.file) {
        inputDir = dirname(css.source.input.file);

        resolver.options.loadPaths = resolver.options.loadPaths || [];
        resolver.options.loadPaths.unshift(inputDir);

        if (params.relative === true) {
          resolver.options.relativeTo = inputDir;
        }
      }

      if (typeof params.relative === 'string') {
        resolver.options.relativeTo = params.relative;
      }
    })
    .use(functions({
      functions: {
        resolve: function resolve(path) {
          var normalizedPath = unquote(unescapeCss(path));
          return resolver.url(normalizedPath).then(formatUrl);
        },
        inline: function inline(path) {
          var normalizedPath = unquote(unescapeCss(path));
          return resolver.data(normalizedPath).then(formatUrl);
        },
        size: function size(path, density) {
          var normalizedPath = unquote(unescapeCss(path));
          return measure(normalizedPath, density).then(formatSize);
        },
        width: function width(path, density) {
          var normalizedPath = unquote(unescapeCss(path));
          return measure(normalizedPath, density).then(formatWidth);
        },
        height: function height(path, density) {
          var normalizedPath = unquote(unescapeCss(path));
          return measure(normalizedPath, density).then(formatHeight);
        }
      }
    }));
}

module.exports = postcss.plugin('postcss-assets', plugin);
