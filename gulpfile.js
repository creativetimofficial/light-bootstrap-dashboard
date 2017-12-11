// Gulp.js configuration
'use strict';

const productname = 'light-bootstrap-dashboard',
      version = 'v2.0.0';

const

  // source and build folders
  dir = {
    src         : '_site/',
    build       : 'dist/'
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  newer         = require('gulp-newer'),
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  deporder      = require('gulp-deporder'),
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),
  prettify      = require('gulp-jsbeautifier'),
  clean         = require('gulp-clean'),
  git           = require('gulp-git'), // https://www.npmjs.com/package/gulp-git
  removeLines   = require('gulp-remove-lines'),
  replace       = require('gulp-replace'),
  zip           = require('gulp-zip');
;

// Browser-sync
var browsersync = false;

// Move HTML settings
const move_html = {
  src           : dir.src + '**/*.html',
  build         : dir.build
};

const move_bootstrap3 = {
  src           : '/BS3/**/*',
  build         : '/dist/BS3/'
};

// copy HTML files
gulp.task('move_html', () => {
  return gulp.src(move_html.src)
    .pipe(newer(move_html.build))
    .pipe(gulp.dest(move_html.build));
});

// copy HTML files
gulp.task('move_bootstrap3_html', () => {
  return gulp.src(['BS3/**/*']).pipe(gulp.dest('dist/BS3'));;
});




// Move MD settings
const move_md = {
  src           : dir.src + '**/*.md',
  build         : dir.build
};

// copy MD files
gulp.task('move_md', () => {
  return gulp.src(move_md.src)
    .pipe(newer(move_md.build))
    .pipe(gulp.dest(move_md.build));
});

// Move SASS folder
const move_sass = {
    src          : 'assets/_scss/**/*.scss',
    build        : dir.build + 'assets/sass/',
}

// Move cssdoc file
const move_cssdoc = {
    src          : dir.src,
    build        : dir.build + 'documentation/css',
}

// copy CSS DOCUMENTATION file
gulp.task('move_cssdoc', () => {
  return gulp.src('documentation/css/*.css')
    .pipe(newer(move_cssdoc.build))
    .pipe(gulp.dest(move_cssdoc.build));
});


// copy Sass files
gulp.task('move_sass', () => {
  return gulp.src(move_sass.src)
    .pipe(newer(move_sass.build))
    .pipe(gulp.dest(move_sass.build));
});

// copy SASS parent
gulp.task('move_sass_parent', () => {
  return gulp.src('assets/css/*.scss')
    .pipe(newer(move_sass.build))
    .pipe(gulp.dest(move_sass.build));
});

// copy full assets
gulp.task('move_js', () => {
  return gulp.src('assets/js/**/*')
    .pipe(newer(dir.build + '/assets/js/'))
    .pipe(gulp.dest(dir.build + '/assets/js/'));
});

gulp.task('move_css', () => {
  return gulp.src('_site/assets/css/**/*')
    .pipe(newer(dir.build + '/assets/css/'))
    .pipe(gulp.dest(dir.build + '/assets/css/'));
});


gulp.task('move_fonts', () => {
  return gulp.src('_site/assets/fonts/**/*')
    .pipe(newer(dir.build + '/assets/fonts/'))
    .pipe(gulp.dest(dir.build + '/assets/fonts/'));
});


gulp.task('move_images', () => {
  return gulp.src('_site/assets/img/**/*')
    .pipe(newer(dir.build + '/assets/img/'))
    .pipe(gulp.dest(dir.build + '/assets/img/'));
});


gulp.task('clean_scss', function () {
    return gulp.src(dir.build + '/assets/css/' + productname + '.scss', {read: false})
        .pipe(clean());
});

// copy min js assets
gulp.task('move_min_js', () => {
  return gulp.src('assets/js/**/*.min.js')
    .pipe(newer(dir.build + '/assets/js/'))
    .pipe(gulp.dest(dir.build + '/assets/js/'));
});

// copy min css assets
gulp.task('move_min_css', () => {
  return gulp.src('assets/css/**/*.min.css')
    .pipe(newer(dir.build + '/assets/css/'))
    .pipe(gulp.dest(dir.build + '/assets/css/'));
});


// image settings
const images = {
  src         : dir.src + 'assets/img/**/*',
  build       : dir.build + 'assets/img/'
};

// image processing
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(newer(images.build))
    .pipe(imagemin({ optimizationLevel: 10 }))
    .pipe(gulp.dest(images.build));
});

gulp.task( "remove-lines-from-scss", function ( ) {
    gulp.src( "assets/css/*.scss" )
        .pipe( replace(
            "---\n# Front matter comment to ensure Jekyll properly reads file.\n---","") )
        .pipe( gulp.dest( "dist/assets/sass/" ) );
});


// CSS settings
var css = {
  src         : dir.src + 'scss/style.scss',
  watch       : dir.src + 'scss/**/*',
  build       : dir.build,
  sassOpts: {
    outputStyle     : 'nested',
    imagePath       : images.build,
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('postcss-assets')({
      loadPaths: ['images/'],
      basePath: dir.build,
      baseUrl: '/wp-content/themes/wptheme/'
    }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 2%']
    }),
    require('css-mqpacker'),
    require('cssnano')
  ]
};


// Zip files up
gulp.task('zip', function () {
 return gulp.src('dist/**/*')
  .pipe(zip(productname + '-html-' + version + '.zip'))
  .pipe(gulp.dest('.'));
});


gulp.task('prettify-html', function() {
  gulp.src(['_site/**/*.html'])
    .pipe(prettify({
        "html": {
            "allowed_file_extensions": ["htm", "html", "xhtml", "shtml", "xml", "svg"],
            "brace_style": "collapse", // [collapse|expand|end-expand|none] Put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are
            "end_with_newline": false, // End output with newline
            "indent_char": " ", // Indentation character
            "indent_handlebars": false, // e.g. {{#foo}}, {{/foo}}
            "indent_inner_html": false, // Indent <head> and <body> sections
            "indent_scripts": "normal", // [keep|separate|normal]
            "indent_size": 4, // Indentation size
            "max_preserve_newlines": 0, // Maximum number of line breaks to be preserved in one chunk (0 disables)
            "preserve_newlines": true, // Whether existing line breaks before elements should be preserved (only works before elements, not inside tags or for text)
            "unformatted": ["sub", "sup", "em", "strong", "i", "u", "strike", "big", "pre"], // List of tags that should not be reformatted
            "wrap_line_length": 0 // Lines should wrap at next opportunity after this number of characters (0 disables)
        }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('prettify-css', function() {
  gulp.src(['_site/assets/css/**/*.css','!_site/assets/css/**/*.min.css'])
    .pipe(prettify({
        "css": {
            "allowed_file_extensions": ["css", "scss", "sass", "less"],
            "end_with_newline": false, // End output with newline
            "indent_char": " ", // Indentation character
            "indent_size": 4, // Indentation size
            "newline_between_rules": true, // Add a new line after every css rule
            "selector_separator": " ",
            "selector_separator_newline": true // Separate selectors with newline or not (e.g. "a,\nbr" or "a, br")
        }
    }))
    .pipe(gulp.dest('dist/assets/css/'));
});

gulp.task('prettify-js', function() {
  gulp.src(['_site/assets/js/**/*.js', '!_site/assets/js/**/*.min.js'])
    .pipe(prettify({
        "js": {
            "allowed_file_extensions": ["js", "json", "jshintrc", "jsbeautifyrc"],
            "brace_style": "collapse", // [collapse|expand|end-expand|none] Put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line, or attempt to keep them where they are
            "break_chained_methods": false, // Break chained method calls across subsequent lines
            "e4x": false, // Pass E4X xml literals through untouched
            "end_with_newline": false, // End output with newline
            "indent_char": " ", // Indentation character
            "indent_level": 0, // Initial indentation level
            "indent_size": 4, // Indentation size
            "indent_with_tabs": false, // Indent with tabs, overrides `indent_size` and `indent_char`
            "jslint_happy": false, // If true, then jslint-stricter mode is enforced
            "keep_array_indentation": false, // Preserve array indentation
            "keep_function_indentation": false, // Preserve function indentation
            "max_preserve_newlines": 0, // Maximum number of line breaks to be preserved in one chunk (0 disables)
            "preserve_newlines": true, // Whether existing line breaks should be preserved
            "space_after_anon_function": false, // Should the space before an anonymous function's parens be added, "function()" vs "function ()"
            "space_before_conditional": true, // Should the space before conditional statement be added, "if(true)" vs "if (true)"
            "space_in_empty_paren": false, // Add padding spaces within empty paren, "f()" vs "f( )"
            "space_in_paren": false, // Add padding spaces within paren, ie. f( a, b )
            "unescape_strings": false, // Should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"
            "wrap_line_length": 0 // Lines should wrap at next opportunity after this number of characters (0 disables)
        }
    }))
    .pipe(gulp.dest('dist/assets/js'));
});


gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('assets/_scss/**/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});


// Move HTML settings
const live_demo = {
  src           : '/dist/**/*',
  build         : '../ct-freebies/public/' + productname + '/'
};

gulp.task('move_live_demo', () => {
  return gulp.src(live_demo.src)
    .pipe(newer(live_demo.build))
    .pipe(gulp.dest(live_demo.build));
});

gulp.task('travis',['move_html'], () => {
    gutil.log('Finished build');
    process.exit(0);
});

gulp.task('prettify',['prettify-html','prettify-css','prettify-js'], () => {
    gutil.log('Finished prettify');
});

// run all tasks old
//gulp.task('build', ['prettify','move_sass', 'move_images', 'move_md', 'move_fonts','clean_scss','move_sass_parent']);

gulp.task('build', ['prettify', 'move_md', 'move_sass', 'move_cssdoc', 'move_images', 'move_min_js', 'move_min_css', 'move_fonts','clean_scss','move_sass_parent','remove-lines-from-scss']);
