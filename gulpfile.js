'use strict';

/* Requirements */
var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var sassGlob = require('gulp-sass-glob'); // globbing for gulp-sass
var iconfont = require('gulp-iconfont'); // To generate an icon-font
var iconfontCss = require('gulp-iconfont-css'); // To generate a css file for the icon-font
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

var argv = require('yargs').argv;
var theme = null;

var pathToAssets = './web/assets/';

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
        .pipe(gulp.dest(pathToAssets+theme+'/styles'))
        .pipe(browserSync.stream());
});

/* Watch */
gulp.task('watch', function () {
    // don't put ./ here, it breaks watching new/deleted files
    gulp.watch('styles/sass--'+theme+'/**/*.scss', ['sass']);
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

gulp.task('vendors', ['set:theme'], function() {
    var cwd = './node_modules/';
    var dest = pathToAssets+theme+'/';

    // Photoswipe
    gulp.src(cwd + 'photoswipe/dist/photoswipe-ui-default.min.js')
        .pipe(gulp.dest(dest + 'scripts/vendors/photoswipe/'));

    gulp.src(cwd + 'photoswipe/dist/photoswipe.min.js')
        .pipe(gulp.dest(dest + 'scripts/vendors/photoswipe/'));

    gulp.src(cwd + 'photoswipe/dist/photoswipe.css')
        .pipe(rename({
            basename: 'photoswipe',
            extname: '.scss'
        }))
        .pipe(gulp.dest('./styles/sass--'+theme+'/vendors/photoswipe/'));

    gulp.src(cwd + 'photoswipe/dist/default-skin/default-skin.css')
        .pipe(rename({
            basename: 'default-skin',
            extname: '.scss'
        }))
        .pipe(gulp.dest('./styles/sass--'+theme+'/vendors/photoswipe/'));

    gulp.src(cwd + 'photoswipe/dist/default-skin/default-skin.png')
        .pipe(gulp.dest(dest + 'styles/'));

    gulp.src(cwd + 'photoswipe/dist/default-skin/default-skin.svg')
        .pipe(gulp.dest(dest + 'styles/'));
});

/* Copy Assets */
gulp.task('copy', ['set:theme'], function() {
    var cwd = pathToAssets+theme+'/';
    var dest = './src/app/public/assets/'+theme+'/';

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
        fontPath = pathToAssets+theme+'/fonts/' + fontName + '/';

    gulp.src([pathToAssets+theme+'/images/svg/*.svg'])
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

/* Minify Javascript */
gulp.task('minify', ['set:theme'], function() {
    var cwd = pathToAssets+theme+'/';
    gulp.src(cwd + 'scripts/**/*.js')
    .pipe(minify({
        ext:{
            src:'.js',
            min:'.min.js'
        },
        exclude: ['vendors'],
        ignoreFiles: ['*.min.js']
    }))
    .pipe(gulp.dest(cwd + 'scripts'))
});


/* Tasks */
gulp.task('grid-sequence', ['set:theme', 'vendors', 'grid', 'normalize']);
gulp.task('sass-sequence', ['set:theme', 'sass']);

gulp.task('build', function () {
    runSequence(
        'grid-sequence',
        'sass-sequence',
        'minify',
        'copy'
    );
});

gulp.task('base', ['set:theme', 'vendors', 'grid', 'normalize', 'sass']);
gulp.task('front', ['set:theme', 'sass', 'watch']);
gulp.task('browsersync', ['browserSync', 'watch']);
