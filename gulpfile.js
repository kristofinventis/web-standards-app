'use strict';

/* Requirements */
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var sassGlob = require('gulp-sass-glob'); // globbing for gulp-sass
var iconfont = require('gulp-iconfont'); // To generate an icon-font
var iconfontCss = require('gulp-iconfont-css'); // To generate a css file for the icon-font
var browserSync = require('browser-sync').create();


/* Builds */
// Build the styleguide grid
gulp.task('grid:styleguide', function() {
    return gulp.src('./styles/sass--grid/grid--styleguide.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./styles/sass--styleguide/components/grid'))
        .pipe(rename('grid-styleguide.scss'))
        .pipe(gulp.dest('./styles/sass--styleguide/components'));
});

// Build the main grid
gulp.task('grid:main', function() {
    return gulp.src('./styles/sass--grid/grid--main.scss.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./styles/sass/components/grid'))
        .pipe(rename('grid-styleguide.scss'))
        .pipe(gulp.dest('./styles/sass/components'));
});

// Build the styleguide front-end
gulp.task('styleguide', function() {
    return gulp.src('./styles/sass--styleguide/styleguide.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./web/assets/default/styles'))
        .pipe(browserSync.stream());
});

// Build the main front-end
gulp.task('main', function() {
    return gulp.src('./styles/sass/main.scss')
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./web/assets/default/styles'))
        .pipe(browserSync.stream());
});

// Rebuild Normalize to scss file
gulp.task('normalize', function() {
    return gulp.src('./node_modules/normalize.css/normalize.css')
        .pipe(rename('normalize.scss'))
        .pipe(gulp.dest('./styles/sass/base/normalize'));
});

// /* Watchers */
// Watch the Styleguide
gulp.task('watch:styleguide', function() {
    gulp.watch('./styles/sass--styleguide/**/*.scss', ['styleguide']);
});

// Watch the Main Front-end
gulp.task('watch:main', function() {
    gulp.watch('./styles/sass/**/*.scss', ['main']);
});


/* Extra Tools */
// Browsersync - Helpfull during development
gulp.task('browserSync', ['front'], function() {
    browserSync.init({
        proxy: '127.0.0.1:8000'
        // proxy: 'www.wsa.ish'
    });

    // Watch sass
    gulp.watch('./styles/sass/**/*.scss', ['main']);
    gulp.watch('./styles/sass--styleguide/**/*.scss', ['styleguide']);

    // Watch components
    gulp.watch('./web/home/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/pages/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/examples/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/partials/**/*').on('change', browserSync.reload);
    gulp.watch('./web/docs/miscellaneous/*').on('change', browserSync.reload);
});


// Generate Icon-font
var fontName = 'project-icons',
    fontPath = 'web/assets/default/fonts/' + fontName + '/';

gulp.task('iconfont', function(){
    gulp.src(['./web/assets/default/images/svg/*.svg'])
    .pipe(iconfontCss({
        fontName: fontName,
        path: './styles/sass/base/_icons-template.scss',
        targetPath: '../../../../../styles/sass/base/icon.scss',
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


// Copy Assets
var cwd = './web/assets/default/';
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


// /* Tasks */
// Styleguide tasks
gulp.task('build--styleguide', ['grid:styleguide', 'styleguide']);
gulp.task('front--styleguide', ['styleguide', 'watch:styleguide']);

// Frond-end tasks
gulp.task('build', ['grid:main', 'normalize', 'main']);
gulp.task('front', ['main', 'watch:main']);
gulp.task('browsersync', ['browserSync', 'watch:main']);
