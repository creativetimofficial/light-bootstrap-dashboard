'use strict';

var expect = require('chai').expect;
var utils  = require('../lib/utils');

describe('utils', function () {

  describe('ascii', function () {
    it('should return the correct string', function () {
      var string = 'Test String%!@#\n';
      var buffer = new Buffer(string);
      var result = utils.ascii(buffer, 0, string.length);
      return expect(result).to.eql(string);
    });
  });

  describe('detectEncoding', function () {
    it('should detect a binary stream', function () {
      var buffer = new Buffer('\xff\xd8\xff\xe0\x00\x10');
      var result = utils.detectEncoding(buffer);
      return expect(result).to.eql('binary');
    });

    it('should detect a utf8 stream', function () {
      var buffer = new Buffer('Hello, World!');
      var result = utils.detectEncoding(buffer);
      return expect(result).to.eql('utf8');
    });
  });

});
