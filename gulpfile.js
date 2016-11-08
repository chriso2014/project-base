(() => {
  'use strict';

  /**
   *
   * Gulp packages
   */
  const gulp = require('gulp');
  const sass = require('gulp-sass');
  const sourcemaps = require('gulp-sourcemaps');
  const neat = require('node-neat');
  const imagemin = require('gulp-imagemin');
  const del = require('del');
  const runSequence = require('run-sequence');
  const babel = require('gulp-babel');
  const concat = require('gulp-concat');
  const rename = require('gulp-rename');
  const uglify = require('gulp-uglify');
  const usemin = require('gulp-usemin');
  const scsslint = require('gulp-scss-lint');
  const eslint = require('gulp-eslint');
  const puglint = require('gulp-pug-lint');
  const size = require('gulp-size');
  const responsive = require('gulp-responsive');
  const foreach = require('gulp-foreach');
  const exec = require('child_process').execSync;

  /**
   * Config files
   */
  const config = require('./config');
  const pkg = require('./package.json');

  /**
   * CSS - SASS tasks.
   * gulp-sourcemaps produces a separate file for the css map
   * gulp-sass light weight wrapper for gulp --> node-sass, uses node-sass config options
   */
  gulp.task('sass', () => {

    return gulp.src(config.devCss + '*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        // Return an array of Neat & Bourbon's paths
        includePaths: neat.includePaths,
        outputStyle: 'compressed',
        version: pkg.version,
        sourceMap: true
      }).on('error', (e) => {
        console.log(e);
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(size({
        title: 'CSS FILE'
      }))
      .pipe(gulp.dest(config.publicCss));
  });


  /**
   * imagemin - ImageMin tasks.
   * Minify PNG, JPEG, GIF and SVG images
   * Comes bundled with the following lossless optimizers:
   * gifsicle — Compress GIF images
   * jpegtran — Compress JPEG images
   * optipng — Compress PNG images
   * svgo — Compress SVG images
  */
  gulp.task('imagemin', () => {

    return gulp.src(config.devImages + '/*')
      .pipe(imagemin({
          optimizationLevel: 7,
          progressive: true,
          svgoPlugins: [{
            removeViewBox: false
          }]
      }))
      .pipe(size({
        title: 'MINIFIED IMAGES'
      }))
      .pipe(gulp.dest(config.publicImages));
  });

  gulp.task('emptyPublic', () => {
    return del([
      config.public + '{,*/}/*'
    ]);
  });

  /**
   * JSMINIFY
   * glob (allows to use glob src)
   * gulp-usemin
   * gulp-concat
   * babel
   * Looks in the .html files that load the app and creates files
   * for the js resources as vendor.js, custom.js and page specific js dependencies,
   * concatenating the sourcefiles and minifiyng it.
   */
  gulp.task('jsminify', () => {
    return gulp.src(config.devScripts + 'components/jsDependencies.html')
      .pipe(usemin({
        js: [ uglify() ],
        js1: [ uglify() ]
      }).on('error', error => {
        console.log('ERROR ON USEMIN' + error);
      }))
      .pipe(size({
        title: 'MINIFIED JS'
      }))
      .pipe(gulp.dest(config.publicScripts));
  });

  /**
   * babel - Use next generation JavaScript, today.
   * Uses es2015 preset
  */
  gulp.task('babel', () => {
    return gulp.src(config.devScripts + 'app/es6/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.devScripts + 'app/compiled'));
  });

  // Copy all other files to public directly
  gulp.task('copy', () => {
    // Root app files
    return gulp.src([config.devRoot + 'favicon.ico', config.devRoot + 'manifest.json'])
    .pipe(gulp.dest(config.public));
  });

  /**
   * gulp-responsive - Generates images at different sizes
   * Depends on sharp. Sharp is one of the fastest Node.js modules for resizing JPEG, PNG, WebP and TIFF images.
  */
  gulp.task('responsiveIMG', function () {
    return gulp.src('src/img/pic/*')
    .pipe(foreach(function(stream, file){
      return stream
      .pipe(responsive({
        'pho-*.jpg': [
          {
            width: config.responsiveImages.photo.setwidth,
          },{
            width: config.responsiveImages.photo.setwidthx2,
            rename: {suffix: config.responsiveImages.photo.suffix}
          }
        ],
        'hero-*.jpg': [
          {
            width: config.responsiveImages.hero.setwidth,
          },{
            width: config.responsiveImages.hero.setwidthx2,
            rename: {suffix: config.responsiveImages.hero.suffix}
          }
        ]
      },{
        errorOnUnusedConfig: false,
        errorOnUnusedImage: false
      }).on('error', error => {
        console.log('ERROR ON responsiveIMG ' + error);
      }))
    }).on('error', error => {
      console.log('ERROR ON forEACH responsiveIMG ' + error);
    }))
    .pipe(gulp.dest(config.publicImages + 'pic'));
});

  /**
   * gulp-scss-lint - validate <code>.scss</code> files with <code>scss-lint</code>
   * requires Ruby and scss-lint
   * Uses default lint.yml rules
  */
  gulp.task('scss-lint', () => {
    return gulp.src(config.devCss + '{,*/}/*.scss')
      .pipe(scsslint({
        'config': 'lint.yml',
        'maxBuffer': 1024000
      }));
  });

  // gulp-eslint - ESLint ignores files with "node_modules" paths.
  // Uses AirBNB rules set out in the root .eslintrc file
  gulp.task('eslint', () => {
    return gulp.src([config.devScripts + 'app/es6/{,*/}*.js','!node_modules/**'])
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError());
  });

  /**
   * gulp-pug-lint - validate <code>.pug</code> files with <code>pug-lint</code>
   * Uses .pug-lintrc file in root.
  */
  gulp.task('pug-lint', () => {
    return gulp.src(config.devTemplates + '{,*/}/*.pug')
      .pipe(puglint());
  });

  // Generic linting task to run all the linting in one command
  // gulp-scss-lint - for all .scss files
  // gulp-eslint - for all es6 .js files
  //
  gulp.task('lint', (callback) => {
    runSequence(
      'scss-lint',
      'eslint',
      'pug-lint',
      callback
    );
  });

  gulp.task('buildJavascript', (callback) => {
    runSequence(
      ['eslint', 'babel'],
      'jsminify',
      callback
    );
  });

  //npm start process and bring up url
  gulp.task('start', () => {
    exec(`npm start`, (err, srt) => {
      console.log(err);
    });
  });

  /**
  * Gulp Build
  * emptyPublic - empty public folder
  * lint - lint js, sass and pug files
  * sass - compile .scss, add mapping, minimise
  * imagemin - minimise images and copy
  * responsiveIMG - create different sized images for different resolutions
  * babel - compile js from es6 format to es5 wider browser coverage
  * jsminify - concatinate javascript files, uglify and copy
  * copy - copy other files needed in the public folder i.e. favicon
  */
  gulp.task('build', (callback) => {
    runSequence(
      'emptyPublic',
      'lint',
      ['sass', 'imagemin', 'responsiveIMG', 'babel'],
      'jsminify',
      'copy',
      callback
    );
  });



  /**
   * Gulp Watch
   */

  gulp.task('watch', () => {
    //jsbabel
    gulp.watch(config.devScripts + 'app/es6/{,*/}*.js', ['buildJavascript']);
    //sass
    gulp.watch(config.devCss + '{,*/}*.scss', ['scss-lint', 'sass']);
    //template
    gulp.watch(config.devTemplates + '{,*/}/*.pug', ['pug-lint']);
    //images
    gulp.watch(config.devImages + '/*.{png,jpg,jpeg,gif,svg}', ['imagemin', 'responsiveIMG']);
  });

  gulp.task('default', (callback) => {
    runSequence(
      'build',
      'watch',
      callback
    );
  });

})();
