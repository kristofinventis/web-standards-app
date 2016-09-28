'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var browserSync = require('browser-sync').create();


/* GULP--MAIN */

    // BUILD THE GRID
    gulp.task('sass:grid--main', function () {
        return sass( 'web/assets/default/sass--grid/grid--main.scss', {
                bundleExec: true,
                scss: true,
                require: ['sass-globbing'],
                style: 'compressed'
        })
        .on('error', sass.logError)
        .pipe(gulp.dest('web/assets/default/sass/components/grid'));
    });


    // REBUILD GRID TO SCSS FILE
    gulp.task('rebuild:grid--main', ['sass:grid--main'], function() {
        gulp.src('web/assets/default/sass/components/grid/grid--main.css')
        .pipe(rename('grid.scss'))
        .pipe(gulp.dest('web/assets/default/sass/components'));
    });


    // WATCH THE GRID
    // gulp.task('sass:watch-grid', function () {
    //     gulp.watch('web/assets/default/sass/grid--main.scss', ['sass:grid']);
    // });


    // REBUILD NORMALIZE TO SCSS FILE
    gulp.task('normalize', function() {
        gulp.src('web/assets/lib/vendor/normalize.css/normalize.css')
        .pipe(rename('normalize.scss'))
        .pipe(gulp.dest('web/assets/default/sass/base/normalize'));
    });


    // REBUILD MAGNIFIC POPUP TO SCSS FILE
    gulp.task('magnific-popup', function() {
        gulp.src('web/assets/lib/vendor/magnific-popup/dist/magnific-popup.css')
        .pipe(rename('magnific-popup.scss'))
        .pipe(gulp.dest('web/assets/default/sass/base/magnific-popup'));
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


    // SVG STORE
    gulp.task('svgstore', function () {
        return gulp
            .src('web/assets/default/images/svg/*.svg')
            .pipe(rename({prefix: 'svg-icon--'}))
            .pipe(svgstore({ inlineSvg: true }))
            .pipe(gulp.dest('web/assets/default/images/'));
    });


    // BROWSERSYNC
    gulp.task('browserSync', ['sass:front'], function() {
        browserSync.init({
            // proxy: '127.0.0.1:8080'
            proxy: 'www.bb.ish'
        });

        gulp.watch('web/assets/default/sass/**/*.scss', ['sass:front']);
        gulp.watch('web/assets/default/sass--styleguide/**/*.scss', ['sass:styleguide']);
        gulp.watch('web/docs/pages/*').on('change', browserSync.reload);
        gulp.watch('web/docs/examples/*').on('change', browserSync.reload);
        gulp.watch('web/docs/partials/**/*').on('change', browserSync.reload);
        gulp.watch('web/docs/miscellaneous/*').on('change', browserSync.reload);
        gulp.watch('web/docs/standards/*').on('change', browserSync.reload);
        gulp.watch('web/home/*').on('change', browserSync.reload);
    });


    // COPY FILES
    var cwd = 'web/assets/default/';
    var dest = './../bricks/src/app/public/assets/default/';

    gulp.task('copy', function() {
        // Styles
        gulp.src(cwd + 'styles/*.css')
            .pipe(gulp.dest(dest + 'styles/'));

        // Images
        gulp.src(cwd + 'images/**/*.{jpg,png,jpeg,svg,gif,ico}')
            .pipe(gulp.dest(dest + 'images/'));

        // Fonts
        gulp.src(cwd + 'fonts/**/*.{ttf,woff,woff2,eot,svg,json}')
            .pipe(gulp.dest(dest + 'fonts/'));

        // Scripts
        gulp.src(cwd + 'scripts/**/*.js')
            .pipe(gulp.dest(dest + 'scripts/'));
    });


    // MAIN TASKS
    gulp.task('build', ['rebuild:grid--main', 'normalize', 'magnific-popup', 'sass:front']);
    gulp.task('grid', ['rebuild:grid--main']);
    gulp.task('front', ['sass:front', 'sass:watch']);
    gulp.task('svg', ['svgstore']);
    gulp.task('browsersync', ['browserSync', 'sass:watch']);







/* GULP STYLEGUIDE */

    // BUILD THE GRID
    gulp.task('sass:grid--styleguide', function () {
        return sass( 'web/assets/default/sass--grid/grid--styleguide.scss', {
                bundleExec: true,
                scss: true,
                require: ['sass-globbing'],
                style: 'compressed'
        })
        .on('error', sass.logError)
        .pipe(gulp.dest('web/assets/default/sass--styleguide/components/grid'));
    });


    // REBUILD GRID TO SCSS FILE
    gulp.task('rebuild:grid--styleguide', ['sass:grid--styleguide'], function() {
        gulp.src('web/assets/default/sass--styleguide/components/grid/grid--styleguide.css')
        .pipe(rename('grid.scss'))
        .pipe(gulp.dest('web/assets/default/sass--styleguide/components'));
    });


    // BUILD THE STYLEGUIDE
    gulp.task('sass:styleguide', function () {
        return sass( 'web/assets/default/sass--styleguide/styleguide.scss', {
            bundleExec: true,
            require: ['sass-globbing']
        })
        .on('error', sass.logError)
        .pipe(gulp.dest('web/assets/default/styles'))
        .pipe(browserSync.stream());
    });


    // WATCH THE STYLEGUIDE
    gulp.task('sass:watch--styleguide', function () {
        gulp.watch('web/assets/default/sass--styleguide/**/*.scss', ['sass:styleguide']);
    });



    // STYLEGUIDE
    gulp.task('build--styleguide', ['rebuild:grid--styleguide', 'sass:styleguide']);
    gulp.task('grid--styleguide', ['rebuild:grid--styleguide']);
    gulp.task('front--styleguide', ['sass:styleguide', 'sass:watch--styleguide']);
