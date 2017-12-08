<img src="https://s3-us-west-2.amazonaws.com/devassets.lob.com/calipers2.jpg" width="700">

[![npm version](https://badge.fury.io/js/calipers.svg)](http://badge.fury.io/js/calipers) [![Build Status](https://travis-ci.org/lob/calipers.svg)](https://travis-ci.org/lob/calipers) [![Coverage Status](https://coveralls.io/repos/lob/calipers/badge.svg)](https://coveralls.io/r/lob/calipers)

Current file types supported: **PDF, PNG, JPEG, GIF**

Calipers was built to provide a method of determining the dimensions of an image or PDF much faster and less resource-intensive than shelling-out to ImageMagick. At [Lob](https://lob.com) we must validate image and PDF sizes during the lifecyle of an API request. The simplest way to do this is to shell-out to ImageMagick to identify the type and size of a file. For high-traffic servers, this becomes a major bottleneck due to the innefficiency of shelling-out.

Calipers remains performant because it avoids spawning child processes and it doesn't read entire files into memory. Instead, it intelligently reads only parts of the files that are necessary to determine the type and the dimensions of the file.

# Installation

Calipers uses a plugin architecture to allow users to include support for only the specific file types they need to measure. This helps avoid wasting CPU cycles measuring file types that an application doesn't support, and ensures users must only install dependencies that are absolutely needed (e.g. Poppler for PDF support).

To use Calipers, you must install the core library and at least one plugin. For example, for PNG support:

```
npm install --save calipers calipers-png
```

Here is a list of officially supported plugins:

File Type | Plugin
--------- | ------
PNG       | [calipers-png](https://github.com/calipersjs/calipers-png)
JPEG      | [calipers-jpeg](https://github.com/calipersjs/calipers-jpeg)
PDF †    | [calipers-pdf](https://github.com/calipersjs/calipers-pdf)
GIF       | [calipers-gif](https://github.com/calipersjs/calipers-gif)

† The [Poppler](http://poppler.freedesktop.org/) library C++ interface is required for PDF support. You must install Poppler before running `npm install calipers-pdf`.

To install Poppler on Mac OS X using Homebrew:

```
brew install poppler
```

To install Poppler on Ubuntu:

```
apt-get install pkg-config
apt-get install libpoppler-cpp-dev
```

To install Calipers, use NPM:

```
npm install calipers
```

# Usage

Calipers must be initialized by calling the required function with supported file types passed in. Use the plugin name's suffix (everything after the first "-") as an argument.

```javascript
// Initializes Calipers with support for calipers-png, calipers-jpeg, calipers-pdf.
var calipers = require('calipers')('png', 'jpeg', 'pdf');
```

Calipers exposes a single function, `measure`, once initialized.

### `measure(filePath, [callback])`

Measures the file at the given path.
- `filePath` - The path of the file.
- `callback` - called when the file has been measured
  - `err` - An Error is thrown for unsupported file types or corrupt files.
  - `result` - Contains keys `type` and `pages`, where `type` is a string representing the file type (e.g. `'png'`), and `pages` is an array of objects with keys `width` and `height`. For image files, `pages` always has 1 element and `width` and `height` are the integer pixel dimensions. For PDF `width` and `height` are floating-point PostScript Point dimensions.

# Examples

```js
var calipers = require('calipers')('png', 'pdf');

// You can use a callback:
calipers.measure('/path/to/document.pdf', function (err, result) {
  // result:
  // {
  //   type: 'pdf',
  //   pages: [
  //     {
  //       width: 450,
  //       height: 670
  //     },
  //     {
  //       width: 450,
  //       height: 670
  //     }
  //   ]
  // }
});

// Or you can use promises:
calipers.measure('/path/to/file.png')
.then(function (result) {
  // result:
  // {
  //   type: 'png',
  //   pages: [
  //     {
  //       width: 450,
  //       height: 670
  //     }
  //   ]
  // }
});
```

# Custom Plugins

*More information coming soon.*

# Benchmarks

As with all benchmarks, take these with a grain of salt. You can run the benchmarks on your own hardware: `node benchmark/index.js`.

These benchmarks are running 500 iterations of each method  on the 123x456 PDF, PNG, and JPEG with a concurrency setting of 50. They were run on a Mid-2014 13" MacBook Pro with a 2.6 GHz Intel Core i5.

Method | FileType | Time (ms)
------ | -------- | ----:
exec: pdfinfo  | PDF | 1897
exec: identify | PNG | 1801
exec: identify | JPEG | 1820
calipers | PDF | 104
calipers | PNG | 41
calipers | JPEG | 80

# Contribute

### Bug Reporting

The easiest and most helpful way to contribute is to find a file that Calipers incorrectly measures, and submit an issue or PR with the file.

### Creating a new Plugin

*More information coming soon.*

#### Inspiration

Inspired by netroy's image-size library: https://github.com/netroy/image-size
