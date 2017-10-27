var resolveSize = require('../lib/size');
var path = require('path');
var test = require('ava');

test('w/o options', function (t) {
  return resolveSize('fixtures/duplicate-1.jpg')
    .then(function (size) {
      t.same(size, { width: 200, height: 114 });
    }, t.fail);
});

test('basePath + loadPaths', function (t) {
  return resolveSize('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  })
    .then(function (size) {
      t.same(size, { width: 200, height: 57 });
    }, t.fail);
});

test('non-existing file', function (t) {
  return resolveSize('non-existing.gif')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    });
});

test('nonsupported file type', function (t) {
  return resolveSize('fixtures/fonts/empty-sans.woff')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'File type not supported: ' + path.resolve('fixtures/fonts/empty-sans.woff'));
    });
});

test('invalid file', function (t) {
  return resolveSize('fixtures/invalid.jpg')
    .then(t.fail, function (err) {
      t.ok(err instanceof Error);
      t.is(err.message, 'Invalid JPEG file: ' + path.resolve('fixtures/invalid.jpg'));
    });
});

test.cb('node-style callback w/o options', function (t) {
  resolveSize('fixtures/duplicate-1.jpg', function (err, size) {
    t.same(size, { width: 200, height: 114 });
    t.end();
  });
});

test.cb('node-style callback w/ options', function (t) {
  resolveSize('picture.png', {
    basePath: 'fixtures',
    loadPaths: ['fonts', 'images']
  }, function (err, size) {
    t.same(size, { width: 200, height: 57 });
    t.end();
  });
});

test.cb('node-style callback + non-existing file', function (t) {
  resolveSize('non-existing.gif', function (err, size) {
    t.ok(err instanceof Error);
    t.is(err.message, 'Asset not found or unreadable: non-existing.gif');
    t.is(size, undefined);
    t.end();
  });
});
