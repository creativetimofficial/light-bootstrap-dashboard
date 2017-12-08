'use strict';

var fs     = require('fs');
var path   = require('path');
var expect = require('chai').expect;
var jpeg   = require('../lib/index');

describe('jpeg', function () {

  describe('detect', function () {
    it('should return true for a JPEG', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/jpeg/123x456.jpg');
      var result = jpeg.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-JPEG', function () {
      var pngPath = path.resolve(__dirname, 'fixtures/png/123x456.png');
      var result = jpeg.detect(fs.readFileSync(pngPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var fixtures = path.resolve(__dirname, 'fixtures/jpeg');
    var files = fs.readdirSync(fixtures);

    files.forEach(function (file) {

      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'jpeg',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        var jpegPath = path.resolve(fixtures, file);
        var fd = fs.openSync(jpegPath, 'r');
        return jpeg.measure(jpegPath, fd)
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        })
        .finally(function () {
          fs.closeSync(fd);
        });
      });

    });

    it('should error with a corrupt JPEG', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/corrupt/corrupt.jpg');
      var fd = fs.openSync(jpegPath, 'r');
      return expect(jpeg.measure(jpegPath, fd)).to.be.rejectedWith(Error);
    });

  });

});
