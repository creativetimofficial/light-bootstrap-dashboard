'use strict';

var fs      = require('fs');
var Promise = require('bluebird');
var pfstat  = Promise.promisify(fs.fstat);
var pread   = Promise.promisify(fs.read, { multiArgs: true });
var utils   = require('./utils');

var BUFFER_SIZE     = 8;
var DETECTOR        = /^\s*</;
var ROOT_MATCHER    = /<svg\s[^>]+>/;
var WIDTH_MATCHER   = /\bwidth=(['"])([^%]+?)\1/;
var HEIGHT_MATCHER  = /\bheight=(['"])([^%]+?)\1/;
var VIEWBOX_MATCHER = /\bviewBox=(['"])(.+?)\1/;

function parseViewbox (viewbox) {
  var bounds = viewbox.split(' ');
  return {
    width: parseInt(bounds[2], 10) - parseInt(bounds[0], 10),
    height: parseInt(bounds[3], 10) - parseInt(bounds[1], 10)
  };
}

function parseAttributes (root) {
  var widthMatches = root.match(WIDTH_MATCHER);
  var heightMatches = root.match(HEIGHT_MATCHER);
  var viewboxMatches = root.match(VIEWBOX_MATCHER);
  return {
    width: widthMatches && parseInt(widthMatches[2], 10),
    height: heightMatches && parseInt(heightMatches[2], 10),
    viewbox: viewboxMatches && parseViewbox(viewboxMatches[2])
  };
}

function findRoot (fd, size, offset, string) {
  if (offset >= size) {
    return Promise.reject(new Error('Invalid SVG file'));
  }

  return pread(fd, new Buffer(BUFFER_SIZE), 0, BUFFER_SIZE, offset)
  .spread(function (bytesRead, buffer) {
    string += utils.ascii(buffer, 0, bytesRead);
    var rootMatches = string.match(ROOT_MATCHER);
    if (rootMatches) {
      return rootMatches[0];
    }
    return findRoot(fd, size, offset + bytesRead, string);
  });
}

exports.detect = function (buffer) {
  return utils.detectEncoding(buffer) === 'utf8' && DETECTOR.test(utils.ascii(buffer));
};

exports.measure = function (path, fd) {
  return pfstat(fd)
  .then(function (stat) {
    return findRoot(fd, stat.size, 0, '');
  })
  .then(function (data) {
    var width;
    var height;
    var attrs = parseAttributes(data);

    if (attrs.width && attrs.height) {
      width = attrs.width;
      height = attrs.height;
    } else if (attrs.viewbox) {
      var ratio = attrs.viewbox.width / attrs.viewbox.height;
      if (attrs.width) {
        width = attrs.width;
        height = Math.round(attrs.width / ratio);
      } else if (attrs.height) {
        width = Math.round(attrs.height * ratio);
        height = attrs.height;
      } else {
        width = attrs.viewbox.width;
        height = attrs.viewbox.height;
      }
    } else {
      return Promise.reject(new Error('Invalid SVG file'));
    }

    return {
      type: 'svg',
      pages: [{
        width: width,
        height: height
      }]
    };
  });
};
