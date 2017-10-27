# Change log

## 4.2.0
**Features:**

* Add `cache` option to cache resolved dimensions (https://github.com/borodean/postcss-assets/pull/73).

## 4.1.0
**Features:**

* `relative` option supports what `relativeTo` option did in 3.x: if a string is passed, paths are generated relatively to a path in that string. A behavior of relating to input files by passing `true` is kept untouched.

**Under the hood:**

* Code updated to match [Airbnb code style](https://github.com/airbnb/javascript).
* Tests converted to ES6 syntax.

## 4.0.1
**Bugfixes**
- Works fine with no options provided (https://github.com/assetsjs/postcss-assets/issues/45).

## 4.0.0
**Breaking**
- Removes `relativeTo` option, introduces `relative` one.

  There is no need to specify a particular file to relate to anymore - set `relative` to `true` and Assets would resolve URLs relatively to the current CSS file.

  This solves the issue when you have stylesheets in different folders and want relative paths — previously there was an option to relate only to a single directory.

  (https://github.com/assetsjs/postcss-assets/issues/42)

**Features**
- Load paths now accept globs:

  ```js
  var options = { loadPaths: ['images', 'assets/**/img'] };
  ```

  (https://github.com/assetsjs/postcss-assets/issues/40)

- Load paths now also accept single strings:

  ```js
  var options = { loadPaths: 'assets/**/img' };
  ```

**Bugfixes**
- Really fixes the SVG rendering on Internet Explorer.
- SCSS flags are preserved (https://github.com/assetsjs/postcss-assets/issues/43).
- No more funky file names in the repo to make Windows archiver happy (https://github.com/assetsjs/postcss-assets/issues/35).
- Allows numbers to be returned from the cachebuster function.

**Under the hood**
- Coverage hits 100%.
- Automated tests against the latest stable nodejs, v0.12 and v4.
- Builds are automatically tested on Windows by [AppVeyor](https://ci.appveyor.com/project/borodean/postcss-assets).
- Switches tests from Mocha to [AVA](https://github.com/sindresorhus/ava).
- Uses [Calipers](https://github.com/calipersjs/calipers) for image measurement instead of image-size.
- Replaces custom function mapper with [postcss-functions](https://github.com/andyjansson/postcss-functions).
- Extracts assets processing logic to the [Assets](https://github.com/assetsjs/assets) module.
- Cleans up dependencies.

## 3.0.3
**Bugfixes**
- no longer uses private `image-size` fork, so properly installs on Windows (https://github.com/borodean/postcss-assets/pull/30, https://github.com/borodean/postcss-assets/issues/32);
- properly calculates dimensions of SVGs with percentage values of `width`/`height` attributes (https://github.com/borodean/postcss-assets/issues/33).

## 3.0.2
**Bugfixes**
* IE understands generated SVG (https://github.com/borodean/postcss-assets/issues/24).

## 3.0.1
**Bugfixes**
- Preserves Microsoft filters (https://github.com/borodean/postcss-assets/issues/27).

**Under the hood**
- Uses ESLint instead of JSHint/JSCS.

## 3.0.0
**API updates**
* better PostCSS 5.0 API conformance (https://github.com/borodean/postcss-assets/issues/25).

## 2.1.4
Since private `image-size` fork was removed, releases 2.1.0—3.0.2 has stopped working. While 3.0.3 release fixes this for the 3.0.x versions, this release is fixing the same for the 2.1.x.

**Bugfixes**
- no longer uses private `image-size` fork (https://github.com/borodean/postcss-assets/issues/37)

## 2.1.3
**Bugfixes**
- better PostCSS plugin API conformance (https://github.com/borodean/postcss-assets/pull/21). This allows plugin to be used with Webpack.

## 2.1.2
**Under the hood**
* [PostCSS Plugin Guidelines](https://github.com/postcss/postcss/blob/master/docs/guidelines/plugin.md) conformance (https://github.com/borodean/postcss-assets/issues/20);
* continious integration tests on both Node.js and io.js;
* shows coverage statistics on the repository page.

## 2.1.1
**Bugfixes**
- fix path separator handling on Windows (https://github.com/borodean/postcss-assets/issues/19).

**Under the hood**
- covers 99% of the code;
- explains code with comments.

## 2.1.0
**API updates**
- extends cachebuster to support modifying the filename (https://github.com/borodean/postcss-assets/pull/17, [docs](https://github.com/borodean/postcss-assets#cachebuster)).

**Bugfixes**
- uses [forked version of image-size](https://github.com/borodean/image-size) to support viewbox-only svgs;
- properly encodes some tricky SVG files (https://github.com/borodean/postcss-assets/pull/18).

**Under the hood**
- uses [Gulp](http://gulpjs.com/) for development routines;
- validates code style with [JSHint](http://jshint.com/) and [JSCS](http://jscs.info/).

## 2.0.0
**API updates**
- Renames `url()` function to `resolve()` https://github.com/borodean/postcss-assets/issues/13
- Resolves assets relative to the source file https://github.com/borodean/postcss-assets/issues/7
- Starts throwing errors instead of warnings https://github.com/borodean/postcss-assets/issues/8
- Fixes a bug when complex URL declarations were crashing Gonzales https://github.com/borodean/postcss-assets/issues/15

**Under the hood**
- Tests with Mocha/Chai instead of Tape https://github.com/borodean/postcss-assets/issues/12
- Updates dependencies upto the latest versions

## 1.1.4
Allows to use common PostCSS plugin API (https://github.com/borodean/postcss-assets/issues/6)
Fixes quotes when inlining SVG (https://github.com/borodean/postcss-assets/pull/14)

## 1.1.3
Base64-encodes with Buffer.

## 1.1.2
Cachebuster recognizes resolved paths.

## 1.1.1
Uses PostCSS 4.0.

## 1.1.0
Introduces [cachebuster](https://github.com/borodean/postcss-assets#cachebuster).

## 1.0.0
* [`width`, `height` and `size` functions][1] are introduced to measure image dimesions with high density pixels support;
* [`inline` function][2] introduced to inline files;
* `url` function automagic is removed;
* `inline.maxSize` option is removed;
* all modifiers are removed.
[1]: https://github.com/borodean/postcss-assets/tree/3168ab2b07cf537240ecc20e0eb7688434987614#image-dimensions
[2]: https://github.com/borodean/postcss-assets/tree/3168ab2b07cf537240ecc20e0eb7688434987614#inlining-files

## 0.9.1
Inlines SVG as UTF-8, not Base64.

## 0.9.0
Hello, world.
