'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();

// BUILD THE GRID
gulp.task('sass:grid--main', function () {
    return sass( 'web/assets/default/sass/grid/grid--main.scss', {
            bundleExec: true,
            scss: true,
            require: ['sass-globbing', 'susy'],
            style: 'compressed'
    })
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/default/sass/components/grid'));
});


// REBUILD GRID TO SCSS FILE
gulp.task('rebuild:grid--main', ['sass:grid--main'], function() {
    gulp.src('web/assets/default/sass/components/grid/grid.css')
    .pipe(rename('grid.scss'))
    .pipe(gulp.dest('web/assets/default/sass/components'));
});


// WATCH THE GRID
gulp.task('sass:watch-grid', function () {
    gulp.watch('web/assets/default/sass/grid.scss', ['sass:grid']);
});


// REBUILD NORMALIZE TO SCSS FILE
gulp.task('normalize', function() {
    gulp.src('web/assets/lib/vendor/normalize.css/normalize.css')
    .pipe(rename('normalize.scss'))
    .pipe(gulp.dest('web/assets/default/sass/base/normalize'));
});


// BUILD THE FRONT
gulp.task('sass:front', function () {
    return sass( 'web/assets/default/sass/main.scss', {
        bundleExec: true,
        require: ['sass-globbing']
    })
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/default/styles'))
    .pipe(browserSync.stream());
});


// WATCH THE FRONT
gulp.task('sass:watch', function () {
    gulp.watch('web/assets/default/sass/**/*.scss', ['sass:front']);
});


// BROWSERSYNC
gulp.task('browserSync', ['sass:front'], function() {
    browserSync.init({
        // proxy: '127.0.0.1:8080'
        proxy: 'www.styleguide.ish'
    });

    gulp.watch('web/assets/default/sass/**/*.scss', ['sass:front']);
    gulp.watch('web/components/pages/*').on('change', browserSync.reload);
    gulp.watch('web/components/partials/**/*').on('change', browserSync.reload);
    gulp.watch('web/components/pageparts/*').on('change', browserSync.reload);
    gulp.watch('web/index.php').on('change', browserSync.reload);
    gulp.watch('web/page.php').on('change', browserSync.reload);
    gulp.watch('web/pagepart.php').on('change', browserSync.reload);
    gulp.watch('web/partial.php').on('change', browserSync.reload);
});


// COPY FILES
var styleguidePath = 'web/assets/default/';
var styleguideDest = './../bricks/web/app/public/assets/default/';

gulp.task('copy', function() {
    // Styles
    gulp.src(styleguidePath + 'styles/*.css')
        .pipe(gulp.dest(styleguideDest+'styles/'));

    // Images
    gulp.src(styleguidePath + 'images/**/*.{jpg,png,jpeg,svg,gif}')
        .pipe(gulp.dest(styleguideDest+'images/'));

    // Fonts
    gulp.src(styleguidePath + 'fonts/**/*.{ttf,woff,eot,svg,json}')
        .pipe(gulp.dest(styleguideDest+'fonts/'));

    // Scripts
    gulp.src(styleguidePath + 'scripts/**/*.js')
        .pipe(gulp.dest(styleguideDest+'scripts/'));
});


// ALL TASKS
// MAIN
gulp.task('build', ['rebuild:grid--main', 'normalize', 'sass:front']);
gulp.task('grid', ['rebuild:grid--main']);
gulp.task('front', ['sass:front', 'sass:watch']);
gulp.task('browsersync', ['browserSync', 'sass:watch']);





/* STYLEGUIDE */


// BUILD THE GRID
gulp.task('sass:grid--styleguide', function () {
    return sass( 'web/assets/default/sass/grid/grid--styleguide.scss', {
            bundleExec: true,
            scss: true,
            require: ['sass-globbing', 'susy'],
            style: 'compressed'
    })
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/default/sass/styleguide/grid'));
});


// REBUILD GRID TO SCSS FILE
gulp.task('rebuild:grid--styleguide', ['sass:grid--styleguide'], function() {
    gulp.src('web/assets/default/sass/styleguide/grid/grid--styleguide.css')
    .pipe(rename('grid.scss'))
    .pipe(gulp.dest('web/assets/default/sass/styleguide'));
});


// BUILD THE STYLEGUIDE
gulp.task('sass:styleguide', function () {
    return sass( 'web/assets/default/sass/styleguide.scss', {
        bundleExec: true,
        require: ['sass-globbing']
    })
    .on('error', sass.logError)
    .pipe(gulp.dest('web/assets/default/styles'))
    .pipe(browserSync.stream());
});


// WATCH THE STYLEGUIDE
gulp.task('sass:watch--styleguide', function () {
    gulp.watch('web/assets/default/sass/**/*.scss', ['sass:styleguide']);
});



// STYLEGUIDE
gulp.task('build--styleguide', ['rebuild:grid--styleguide', 'sass:styleguide']);
gulp.task('grid--styleguide', ['rebuild:grid--styleguide']);
gulp.task('front--styleguide', ['sass:styleguide', 'sass:watch--styleguide']);
