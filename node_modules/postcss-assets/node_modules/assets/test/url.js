var fs = require('fs');
var path = require('path');
var resolveUrl = require('../lib/url');
var sinon = require('sinon');
var test = require('ava');

test.before(function () {
  sinon.stub(fs, 'statSync').returns({
    mtime: new Date(Date.UTC(1991, 7, 24))
  });
});

test.after(function () {
  fs.statSync.restore();
});

test('w/o options', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg')
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    }, t.fail);
});

test('basePath', function (t) {
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/duplicate-1.jpg');
    }, t.fail);
});

test('baseUrl', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    baseUrl: 'http://example.com/wp-content/themes'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/fixtures/duplicate-1.jpg');
    }, t.fail);
});

test('loadPaths', function (t) {
  return resolveUrl('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png');
    }, t.fail);
});

test('relativeTo', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl', function (t) {
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/duplicate-1.jpg');
    }, t.fail);
});

test('basePath + loadPaths', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/images/picture.png');
    }, t.fail);
});

test('basePath + relativeTo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('baseUrl + loadPaths', function (t) {
  return resolveUrl('picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fixtures/fonts', 'fixtures/images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/fixtures/images/picture.png');
    }, t.fail);
});

test('baseUrl + relativeTo', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl + loadPaths', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, 'http://example.com/wp-content/themes/images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl + relativeTo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images'],
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('baseUrl + loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fixtures/fonts', 'fixtures/images'],
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('basePath + baseUrl + loadPaths + relativeTo', function (t) {
  return resolveUrl('picture.png', {
    basePath: 'fixtures',
    baseUrl: 'http://example.com/wp-content/themes',
    loadPaths: ['fonts', 'images'],
    relativeTo: 'fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('absolute basePath + relativeTo', function (t) {
  return resolveUrl('images/picture.png', {
    basePath: path.resolve('fixtures'),
    relativeTo: path.resolve('fixtures/fonts')
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png');
    }, t.fail);
});

test('non-existing file', function (t) {
  return resolveUrl('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test('baseUrl w/ trailing slash', function (t) {
  return resolveUrl('fixtures/images/picture.png', {
    baseUrl: 'http://example.com/wp-content/themes/'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, ('http://example.com/wp-content/themes/fixtures/images/picture.png'));
    }, t.fail);
});

test('default cachebuster', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: true
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?9f057edc00');
    }, t.fail);
});

test('custom cachebuster w/ falsy result', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: function () { return; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    }, t.fail);
});

test('custom cachebuster w/ string result', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: function () { return 'bust'; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?bust');
    }, t.fail);
});

test('custom cachebuster w/ number result', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: function () { return 42; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?42');
    }, t.fail);
});

test('custom cachebuster w/ pathname', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: function () { return { pathname: '/foo.png' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png');
    }, t.fail);
});

test('custom cachebuster w/ query', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: function () { return { query: 'bust' }; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/duplicate-1.jpg?bust');
    }, t.fail);
});

test('custom cachebuster w/ pathname + query', function (t) {
  return resolveUrl('fixtures/duplicate-1.jpg', {
    cachebuster: function () { return { pathname: '/foo.png', query: 'bust' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png?bust');
    }, t.fail);
});

test('custom cachebuster arguments', function (t) {
  var cachebuster = sinon.spy();
  return resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures',
    cachebuster: cachebuster
  })
    .then(function () {
      t.ok(cachebuster.calledOnce);
      t.is(cachebuster.lastCall.args.length, 2);
      t.is(cachebuster.lastCall.args[0], path.resolve('fixtures/duplicate-1.jpg'));
      t.is(cachebuster.lastCall.args[1], '/duplicate-1.jpg');
    }, t.fail);
});

test('query + hash', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash')
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ default cachebuster', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: true
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ falsy result', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ string result', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return 'bust'; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&bust#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ pathname', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return { pathname: '/foo.png' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png?foo=bar&baz#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ query', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return { query: 'bust' }; }
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/images/picture.png?foo=bar&baz&bust#hash');
    }, t.fail);
});

test('query + hash w/ custom cachebuster w/ pathname + query', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    cachebuster: function () { return { pathname: '/foo.png', query: 'bust' }; } // TODO leading slash
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/foo.png?foo=bar&baz&bust#hash');
    }, t.fail);
});

test('query + hash w/ relativeTo', function (t) {
  return resolveUrl('fixtures/images/picture.png?foo=bar&baz#hash', {
    relativeTo: 'fixtures/fonts'
  })
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '../images/picture.png?foo=bar&baz#hash');
    }, t.fail);
});

test('URI-encoded needle', function (t) {
  return resolveUrl('fixtures/white%20space.txt')
    .then(function (resolvedUrl) {
      t.is(resolvedUrl, '/fixtures/white%20space.txt');
    }, t.fail);
});

test.cb('node-style callback w/o options', function (t) {
  resolveUrl('fixtures/duplicate-1.jpg', function (err, resolvedUrl) {
    t.is(err, null);
    t.is(resolvedUrl, '/fixtures/duplicate-1.jpg');
    t.end();
  });
});

test.cb('node-style callback w/ options', function (t) {
  resolveUrl('duplicate-1.jpg', {
    basePath: 'fixtures'
  }, function (err, resolvedUrl) {
    t.is(err, null);
    t.is(resolvedUrl, '/duplicate-1.jpg');
    t.end();
  });
});

test.cb('node-style callback + non-existing file', function (t) {
  resolveUrl('non-existing.gif', function (err, resolvedUrl) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedUrl, undefined);
    t.end();
  });
});
