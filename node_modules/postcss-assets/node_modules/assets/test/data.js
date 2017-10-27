var resolveData = require('../lib/data');
var test = require('ava');

test('w/o options', function (t) {
  return resolveData('fixtures/duplicate-1.jpg')
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
      t.is(resolvedDataUrl.slice(-32), 'GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=');
    }, t.fail);
});

test('basePath + loadPaths', function (t) {
  return resolveData('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
      t.is(resolvedDataUrl.slice(-32), '+BPCufaJraBKlQAAAABJRU5ErkJggg==');
    }, t.fail);
});

test('discard query + preserve hash', function (t) {
  return resolveData('fixtures/duplicate-1.jpg?foo=bar#hash')
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
      t.is(resolvedDataUrl.slice(-32), 'rSpUIsvhA1vsPh/WlSpVprP/9k=#hash');
    }, t.fail);
});

test('svg', function (t) {
  return resolveData('fixtures/images/vector.svg')
    .then(function (resolvedDataUrl) {
      t.is(resolvedDataUrl.slice(0, 32), 'data:image/svg+xml;charset=utf-8');
      t.is(resolvedDataUrl.slice(-32), '0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E');
    }, t.fail);
});

test('non-existing file', function (t) {
  return resolveData('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test.cb('node-style callback w/o options', function (t) {
  resolveData('fixtures/duplicate-1.jpg', function (err, resolvedDataUrl) {
    t.is(err, null);
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/jpeg;base64,/9j/4AAQS');
    t.end();
  });
});

test.cb('node-style callback w/ options', function (t) {
  resolveData('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }, function (err, resolvedDataUrl) {
    t.is(err, null);
    t.is(resolvedDataUrl.slice(0, 32), 'data:image/png;base64,iVBORw0KGg');
    t.end();
  });
});

test.cb('node-style callback + non-existing file', function (t) {
  resolveData('non-existing.gif', function (err, resolvedDataUrl) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(resolvedDataUrl, undefined);
    t.end();
  });
});
