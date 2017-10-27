'use strict';

var fs     = require('fs');
var path   = require('path');
var expect = require('chai').expect;
var png    = require('../lib/index');

describe('png', function () {

  describe('detect', function () {
    it('should return true for a PNG', function () {
      var pngPath = path.resolve(__dirname, 'fixtures/png/123x456.png');
      var result = png.detect(fs.readFileSync(pngPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-PNG', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/jpeg/123x456.jpg');
      var result = png.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var fixtures = path.resolve(__dirname, 'fixtures/png');
    var files = fs.readdirSync(fixtures);

    files.forEach(function (file) {

      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'png',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        var pngPath = path.resolve(fixtures, file);
        var fd = fs.openSync(pngPath, 'r');
        return png.measure(pngPath, fd)
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        })
        .finally(function () {
          fs.closeSync(fd);
        });
      });

    });

  });

});
