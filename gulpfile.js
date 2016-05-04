'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var browserSync = require('browser-sync').create();
var argv = require('yargs').argv;
var theme = null;


// SET THEME
gulp.task('set:theme', function() {
    theme = (typeof argv.theme === 'undefined') ? 'default' : argv.theme;
    console.log(theme);
});



// BUILD THE GRID
gulp.task('sass:grid', function () {
    return sass( 'web/assets/'+theme+'/sass/grid.scss', {
        bundleExec: true,
        scss: true,
        require: ['sass-globbing'],
        style: 'compressed'
    })
        .on('error', sass.logError)
        .pipe(gulp.dest('web/assets/'+theme+'/styles'));
});

// BUILD GRID FILE
gulp.task('build:grid', ['sass:grid'], function() {
    gulp.src('web/assets/'+theme+'/styles/grid.css')
        .pipe(rename('grid.scss'))
        .pipe(gulp.dest('web/assets/'+theme+'/sass/components'));
});



// REBUILD NORMALIZE TO SCSS FILE
gulp.task('normalize', function() {
    gulp.src('web/assets/vendor/normalize.css/normalize.css')
        .pipe(rename('normalize.scss'))
        .pipe(gulp.dest('web/assets/vendor-processed/normalize.css'));
});


// REBUILD MAGNIFIC POPUP TO SCSS FILE
gulp.task('magnific-popup', function() {
    gulp.src('web/assets/vendor/magnific-popup/dist/magnific-popup.css')
        .pipe(rename('magnific-popup.scss'))
        .pipe(gulp.dest('web/assets/vendor-processed/magnific-popup'));
});



// BUILD THE FRONT
gulp.task('sass:front', function () {
    return sass( 'web/assets/'+theme+'/sass/main.scss', {
        bundleExec: true,
        require: ['sass-globbing']
    })
        .on('error', sass.logError)
        .pipe(gulp.dest('web/assets/'+theme+'/styles'))
        .pipe(browserSync.stream());
});


// WATCH THE FRONT
gulp.task('sass:watch', function () {
    gulp.watch('web/assets/'+theme+'/sass/**/*.scss', ['sass:front']);
});


// BUILD THE CKEDITOR
gulp.task('sass:ckeditor', function () {
    return sass( 'web/assets/'+theme+'/sass/ckeditor.scss', {
        bundleExec: true,
        require: ['sass-globbing']
    })
        .on('error', sass.logError)
        .pipe(gulp.dest('web/assets/'+theme+'/styles'))
        .pipe(browserSync.stream());
});


// SVG STORE
gulp.task('svgstore', function () {
    return gulp
        .src('web/assets/'+theme+'/images/svg/*.svg')
        .pipe(rename({prefix: 'svg-icon--'}))
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(gulp.dest('web/assets/'+theme+'/images/'));
});


// BROWSERSYNC
gulp.task('browserSync', ['sass:front'], function() {
    browserSync.init({
        // proxy: '127.0.0.1:8080'
        proxy: 'standards.inventis.iwh'
    });

    gulp.watch('web/assets/default/sass/**/*.scss', ['sass:front']);
    gulp.watch('web/assets/styleguide/sass/**/*.scss', ['sass:styleguide']);
    gulp.watch('web/docs/pages/*').on('change', browserSync.reload);
    gulp.watch('web/docs/examples/*').on('change', browserSync.reload);
    gulp.watch('web/docs/partials/**/*').on('change', browserSync.reload);
    gulp.watch('web/docs/miscellaneous/*').on('change', browserSync.reload);
    gulp.watch('web/docs/standards/*').on('change', browserSync.reload);
    gulp.watch('web/home/*').on('change', browserSync.reload);
});


// COPY FILES
gulp.task('copy', ['set:theme'], function() {
    var cwd = 'web/assets/'+theme+'/';
    var dest = './../src/app/public/assets/'+theme+'/';

    // Styles
    gulp.src(cwd + 'styles/*.css')
        .pipe(gulp.dest(dest + 'styles/'));

    // Images
    gulp.src(cwd + 'images/**/*.{jpg,png,jpeg,svg,gif,ico}')
        .pipe(gulp.dest(dest + 'images/'));

    // Scripts
    gulp.src(cwd + 'scripts/**/*.js')
        .pipe(gulp.dest(dest + 'scripts/'));
});


// WATCH AND COPY (very handy for small changes after slicing)
gulp.task('watch-copy', ['set:theme'], function () {
    gulp.watch('web/assets/'+theme+'/sass/**/*.scss', ['sass:front']);
    gulp.watch(['web/assets/'+theme+'/styles/*.css', 'web/assets/'+theme+'/scripts/**/*.js', 'web/assets/'+theme+'/images/**/*.*'], ['copy']);
});


// MAIN TASKS
gulp.task('build',          ['set:theme', 'build:grid', 'normalize', 'magnific-popup', 'sass:front', 'sass:ckeditor']);
gulp.task('build-copy',     ['set:theme', 'build', 'copy']);
gulp.task('grid',           ['set:theme', 'build:grid']);
gulp.task('front',          ['set:theme', 'sass:front', 'sass:watch']);
gulp.task('svg',            ['set:theme', 'svgstore']);
gulp.task('browsersync',    ['set:theme', 'browserSync', 'sass:watch']);

// ALIASES
gulp.task('bc', ['build-copy']);
gulp.task('wc', ['watch-copy']);
gulp.task('bs', ['browsersync']);