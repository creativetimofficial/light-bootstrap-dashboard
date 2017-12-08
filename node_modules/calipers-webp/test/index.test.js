'use strict';

var fs     = require('fs');
var path   = require('path');
var expect = require('chai').expect;
var webp   = require('../lib/index');

describe('webp', function () {

  describe('detect', function () {
    it('should return true for a WEBP', function () {
      var webpPath = path.resolve(__dirname, 'fixtures/webp/213x322.lossy.webp');
      var result = webp.detect(fs.readFileSync(webpPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-WEBP', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/jpeg/123x456.jpg');
      var result = webp.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var fixtures = path.resolve(__dirname, 'fixtures/webp');
    var files = fs.readdirSync(fixtures);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'webp',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        var webpPath = path.resolve(fixtures, file);
        var fd = fs.openSync(webpPath, 'r');
        return webp.measure(webpPath, fd)
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        })
        .finally(function () {
          fs.closeSync(fd);
        });
      });
    });

    it('should error with a corrupt WEBP', function () {
      var webpPath = path.resolve(__dirname, 'fixtures/corrupt/corrupt.webp');
      var fd = fs.openSync(webpPath, 'r');
      return expect(webp.measure(webpPath, fd)).to.be.rejectedWith(Error);
    });

  });

});
