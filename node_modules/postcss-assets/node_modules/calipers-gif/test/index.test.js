'use strict';

var fs     = require('fs');
var path   = require('path');
var expect = require('chai').expect;
var gif    = require('../lib/index');

describe('gif', function () {

  describe('detect', function () {
    it('should return true for a GIF', function () {
      var gifPath = path.resolve(__dirname, 'fixtures/gif/245x260.gif');
      var result = gif.detect(fs.readFileSync(gifPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-GIF', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/jpeg/123x456.jpg');
      var result = gif.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var fixtures = path.resolve(__dirname, 'fixtures/gif');
    var files = fs.readdirSync(fixtures);

    files.forEach(function (file) {

      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'gif',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        var gifPath = path.resolve(fixtures, file);
        var fd = fs.openSync(gifPath, 'r');
        return gif.measure(gifPath, fd)
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
