'use strict';

/* Requirements */
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sassGlob = require('gulp-sass-glob'); // globbing for gulp-sass
var iconfont = require('gulp-iconfont'); // To generate an icon-font
var iconfontCss = require('gulp-iconfont-css'); // To generate a css file for the icon-font
var browserSync = require('browser-sync').create();

var argv = require('yargs').argv;
var theme = null;

/* Set Theme */
gulp.task('set:theme', function() {
    theme = (typeof argv.theme === 'undefined') ? 'default' : argv.theme;
    console.log(theme);
});

/* Rebuild Normalize to scss file */
gulp.task('normalize', function() {
    return gulp.src('./node_modules/normalize.css/normalize.css')
        .pipe(rename({
            basename: 'normalize',
            extname: '.scss'
        }))
        .pipe(gulp.dest('./styles/sass--'+theme+'/base/normalize'));
});

/* Build the grid */
gulp.task('grid', function() {
    return gulp.src('./styles/sass--grid/grid--'+theme+'.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./styles/sass--'+theme+'/components/grid'))
        .pipe(rename({
            basename: 'grid-'+theme+'',
            extname: '.scss'
        }))
        .pipe(gulp.dest('./styles/sass--'+theme+'/components'));
});

/* Build the front-end */
gulp.task('sass', function() {
    return gulp.src('./styles/sass--'+theme+'/main.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./web/assets/'+theme+'/styles'))
        .pipe(browserSync.stream());
});

/* Watch */
gulp.task('watch', function () {
    gulp.watch('./styles/sass--'+theme+'/**/*.scss', [''+theme+'']);
});

/* Browsersync */
gulp.task('browserSync', ['front'], function() {
    browserSync.init({
        proxy: '127.0.0.1:8000'
        // proxy: 'www.wsa.ish'
    });

    // Watch sass
    gulp.watch('./styles/sass--'+theme+'/**/*.scss', ['sass']);

    // Watch components
    gulp.watch('./web/home/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/pages/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/examples/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/partials/**/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/miscellaneous/*').on('change', browserSync.reload);
});


/* Copy Assets */
gulp.task('copy', ['set:theme'], function() {
    var cwd = './web/assets/'+theme+'/';
    var dest = './../bricks/src/app/public/assets/'+theme+'/';

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


/* Generate Icon-font */
gulp.task('iconfont', ['set:theme'], function(){
    var fontName = 'project-icons',
        fontPath = './web/assets/'+theme+'/fonts/' + fontName + '/';

    gulp.src(['./web/assets/'+theme+'/images/svg/*.svg'])
    .pipe(iconfontCss({
        fontName: fontName,
        path: './styles/sass--'+theme+'/base/_icons-template.scss',
        targetPath: '../../../../../styles/sass--'+theme+'/base/icon.scss',
        cssClass: 'icon',
        fontPath: fontPath
    }))
    .pipe(iconfont({
        fontName: fontName,
        formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // 'ttf', 'eot', 'woff', 'woff2' and 'svg' are available
        normalize: true,
    }))
    .pipe(gulp.dest(fontPath));
});


/* Tasks */
gulp.task('build', ['set:theme', 'grid', 'normalize', 'sass']);
gulp.task('front', ['set:theme', 'sass', 'watch']);
gulp.task('browsersync', ['browserSync', 'watch']);
