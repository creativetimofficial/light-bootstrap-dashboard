'use strict';

var fs      = require('fs');
var path    = require('path');
var expect  = require('chai').expect;
var Promise = require('bluebird');
var popen   = Promise.promisify(fs.open);
var detect  = require('../lib/detect');

describe('detect', function () {

  var txtPath = path.resolve(__dirname, 'fixtures/file.txt');

  var fakeTruePlugin = {
    detect: function (buffer) { 
      return buffer.toString('ascii', 0, 12) === 'A text file.';
    }
  };

  var fakeFalsePlugin = {
    detect: function () { 
      return false;
    }
  };

  it('should return the first plugin that returns true', function () {
     return popen(txtPath, 'r')
     .then(function (fd) {
       return detect(fd, [fakeFalsePlugin, fakeTruePlugin]);
     })
     .then(function (plugin) {
       expect(plugin).to.eql(fakeTruePlugin);
    });
  });

  it('should throw an error for an unsupported file type', function () {
    return popen(txtPath, 'r')
    .then(function (fd) {
      return expect(detect(fd, [fakeFalsePlugin])).to.be.rejectedWith(Error);
    });
  });

});
