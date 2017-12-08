'use strict';

var fs     = require('fs');
var path   = require('path');
var expect = require('chai').expect;
var svg    = require('../lib/index');

describe('svg', function () {

  describe('detect', function () {

    it('should return true for a SVG', function () {
      var svgPath = path.resolve(__dirname, 'fixtures/svg/100x60.svg');
      var result = svg.detect(fs.readFileSync(svgPath));
      expect(result).to.eql(true);
    });

    it('should return false for a non-SVG', function () {
      var jpegPath = path.resolve(__dirname, 'fixtures/jpeg/123x456.jpg');
      var result = svg.detect(fs.readFileSync(jpegPath));
      expect(result).to.eql(false);
    });
  });

  describe('measure', function () {

    var fixtures = path.resolve(__dirname, 'fixtures/svg');
    var files = fs.readdirSync(fixtures);

    files.forEach(function (file) {
      var fileSplit = file.split(/x|\./);
      var width = parseInt(fileSplit[0]);
      var height = parseInt(fileSplit[1]);
      var expectedOutput = {
        type: 'svg',
        pages: [{ width: width, height: height }]
      };

      it('should return the correct dimensions for ' + file, function () {
        var svgPath = path.resolve(fixtures, file);
        var fd = fs.openSync(svgPath, 'r');
        return svg.measure(svgPath, fd)
        .bind({})
        .then(function (result) {
          expect(result).to.eql(expectedOutput);
        })
        .finally(function () {
          fs.closeSync(fd);
        });
      });
    });

    it('should error with a corrupt SVG', function () {
      var svgPath = path.resolve(__dirname, 'fixtures/corrupt/corrupt.svg');
      var fd = fs.openSync(svgPath, 'r');
      return expect(svg.measure(svgPath, fd)).to.be.rejectedWith(Error);
    });

    it('should error with a SVG with no dimensions', function () {
      var svgPath = path.resolve(__dirname, 'fixtures/corrupt/no_dimensions.svg');
      var fd = fs.openSync(svgPath, 'r');
      return expect(svg.measure(svgPath, fd)).to.be.rejectedWith(Error);
    });

  });

});
