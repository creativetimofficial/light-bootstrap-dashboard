'use strict';

var path     = require('path');
var expect   = require('chai').expect;
var calipers = require('../lib/index');

describe('index', function () {

  var txtPath = path.resolve(__dirname, 'fixtures/file.txt');
  var pngPath = path.resolve(__dirname, 'fixtures/123x456.png');
  var output = {
    type: 'txt',
    pages: [{ width: 0, height: 0 }]
  };

  var fakeTruePlugin = {
    detect: function (buffer) { 
      return buffer.toString('ascii', 0, 12) === 'A text file.';
    },
    measure: function () {
      return output;
    }
  };

  var fakeFalsePlugin = {
    detect: function () { 
      return false;
    }
  };

  it('works with callbacks', function (done) {
    var calipers = require('../lib/index')(fakeFalsePlugin, 'png', fakeTruePlugin);
    calipers.measure(txtPath, function (err, result) {
      expect(result).to.eql(output);
      done();
    });
  });

  it('works with promises', function () {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeTruePlugin, 'png');
    return calipers.measure(txtPath)
    .then(function (result) {
      expect(result).to.eql(output);
    });
  });

  it('works with required plugins', function () {
    var calipers = require('../lib/index')(fakeFalsePlugin, fakeTruePlugin, 'png');
    return calipers.measure(pngPath)
    .then(function (result) {
      expect(result).to.eql({ type: 'png', pages: [{ width: 123, height: 456 }] });
    });
  });

});
