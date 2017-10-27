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

});
