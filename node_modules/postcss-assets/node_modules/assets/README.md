<h1 align="center">
  <img src="https://rawgit.com/assetsjs/assets/develop/media/logo.svg" alt="assets">
</h1>

Assets is an asset manager for node. It isolates assets from environmental changes, gets generates their URLs, retrieves image sizes and base64-encodes them.

[![Unix Build Status][travis-badge]][travis] [![Windows Build Status][appveyor-badge]][appveyor] [![Coverage][coveralls-badge]][coveralls]

[appveyor]:        https://ci.appveyor.com/project/borodean/assets
[appveyor-badge]:  https://img.shields.io/appveyor/ci/borodean/assets.svg?label=windows
[coveralls]:       https://coveralls.io/github/borodean/assets
[coveralls-badge]: https://img.shields.io/coveralls/borodean/assets.svg
[travis]:          https://travis-ci.org/borodean/assets
[travis-badge]:    https://img.shields.io/travis/borodean/assets.svg?label=unix

## Installation

```bash
npm install assets --save
```

## Usage

An instance of Assets should be created:

```js
var options = { loadPaths: ['fonts', 'images'] };
var resolver = new Assets(options);
```

Each of the resolving methods returns a Promise:

```js
resolver.path('foobar.jpg')
  .then(function (resolvedPath) {
    // ....
  });
```

To use a node-style callback, pass it as the last argument to the resolving method:

```js
resolver.path('foobar.jpg', function (err, resolvedPath) {
  // ...
});
```

## Resolving methods

### `.path(path)`
Resolve the absolute path for an asset.

```js
var resolver = new Assets({ loadPaths: ['assets'] });
resolver.path('patterns/knitwork.gif')
  .then(function (resolvedPath) {
    console.log(resolvedPath); // '/var/www/example.com/assets/patterns/knitwork.gif'
  });
```

### `.url(path)`
Generates an URL for an asset.

```js
var resolver = new Assets({ loadPaths: ['assets/images'] });
resolver.url('page/background.jpg')
  .then(function (resolvedUrl) {
    console.log(resolvedUrl); // '/assets/images/page/background.jpg'
  });
```

### `.data(path)`
Returns a base64-encoded content of an asset. SVG files would be non-encoded, because then [they benefit in size](http://css-tricks.com/probably-dont-base64-svg/).

```js
var resolver = new Assets();
resolver.data('icons/sabre.png')
  .then(function (resolvedData) {
    console.log(resolvedData); // 'data:image/png;base64,...'
  });
```

### `.size(path)`
Return the size of an asset.

```js
var resolver = new Assets();
resolver.size('logo.png')
  .then(function (resolvedSize) {
    console.log(resolvedSize); // '{ width: 132, height: 48 }'
  });
```

Options
-------

Options are set by passing an options object to the constructor. Available options are:

### `basePath`
The path to the root of the project.

For example: `"source/"`.

Defaults to the current working directory.

### `baseUrl`
URL of the project when running withing the web server.

For example: `"/wp-content/themes/twentyfourteen"`, `"http://example.com"`.

Defaults to `"/"`.

### `cachebuster`
If cache should be busted. If set to `true`, Assets will bust assets cache, changing urls depending on asset’s modification date:

```js
var resolver = new Assets({ cachebuster: true, loadPaths: ['assets/images'] });
resolver.url('page/background.jpg')
  .then(function (resolvedUrl) {
    console.log(resolvedUrl); // '/assets/images/page/background.jpg?14a931c501f'
  });
```

To define a custom cachebuster pass a function as an option:

```js
var resolver = new Assets({
  cachebuster: function (resolvedPath, pathname) {
    return fs.statSync(resolvedPath).mtime.getTime().toString(16);
  }
});
```

If the returned value is falsy, no cache busting is done for the asset.

If the returned value is an object the values of pathname and/or query are used to generate a cache busted path to the asset.

If the returned value is a string, it is added as a query string.

The returned values for query strings must not include the starting ?.

Busting the cache via path:

```js
var resolver = new Assets({
  cachebuster: function (resolvedPath, pathname) {
    var hash = fs.statSync(resolvedPath).mtime.getTime().toString(16);
    return {
      pathname: path.dirname(pathname)
        + '/' + path.basename(pathname, path.extname(pathname))
        + hash + path.extname(pathname),
      query: false // you may omit this one
    }
  }
});
```

Defaults to `false`.

### `loadPaths`
Specific directories to look for the files.

For example: `["assets/fonts", "assets/images"]`.

Defaults to an empty array.

### `relativeTo`
Directory to relate to when resolving URLs. When `false`, disables relative URLs.

For example: `"assets/css"`.

Defaults to `false`.

Path resolution
---------------

Assets provide a file path resolution algorithm similar to the one used by desktop file systems.

This may come in handy when you have different directories for different types of assets, e.g. images, fonts. You add those to the list of load paths when configuring Assets:

```js
var resolver = new Assets({
  loadPaths: ['assets/fonts', 'assets/images']
});
```

Now, instead of writing this:

```js
var url = '/assets/images/icons/create.png';
var url = '/assets/images/icons/read.png';
var url = '/assets/images/icons/update.png';
var url = '/assets/images/icons/delete.png';
```

You can write this:

```js
var url = resolver.path('icons/create.png');
var url = resolver.path('icons/read.png');
var url = resolver.path('icons/update.png');
var url = resolver.path('icons/delete.png');
```

Apart from the fact that these lines are just shorter, it gives you an opportunity to easily change the environment and the way the URLs are being output much quicker.

For instance, if you move all the images from `assets/images` to `client/source/images` you wouldn't need to go through all of your stylesheets to replace the URLs, you would just need to edit the corresponding parameter inside your Assets config:

```js
var resolver = new Assets({
  loadPaths: ['assets/fonts', 'client/source/images']
});
```

When resolving a path, Assets would look for it through every of the following paths in the listed order:

* load paths;
* base path.

Path resolution also gives an opportunity to easily change the URL structure when the directory structure of the project on your computer is not exactly the same as it would be on the server.

For instance, if you have a Wordpress theme project, you may want to append `/wp-content/themes/your-theme-name` to every URL inside of your stylesheet. This is done by providing a `baseUrl` parameter to Assets config:

```js
var resolver = new Assets({
  baseUrl: '/wp-content/themes/your-theme-name'
});
```

Now everything would be resolved relative to that base URL:

```js
resolver.url('images/create.png')
  .then(function (resolvedUrl) {
    console.log(resolvedUrl); // '/wp-content/themes/your-theme-name/images/create.png'
  });
```
