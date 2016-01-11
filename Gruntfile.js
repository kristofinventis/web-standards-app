module.exports = function(grunt) {
    // Project configuration.

    var currentWorkingDirectory = 'src/';
    var styleguidePath = 'assets/default/';
    var styleguideDest = '../src/app/public/';

    grunt.initConfig({
        watch: {
            front: {
                files: 'src/assets/default/sass/**/*.scss',
                tasks: ['sass:front']
            },
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'src/assets/default/styles/main.css',
                        'src/assets/default/scripts/**/*',
                        'src/components/pages/*',
                        'src/components/partials/**/*',
                        'src/components/pageparts/*',
                        'src/index.php',
                        'src/page.php',
                        'src/pagepart.php',
                        'src/partial.php'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: '127.0.0.1:8080'
                }
            }
        },
        sass: {
            base: {
                options: {
                    bundleExec: true,
                    style: 'compressed',
                    require: ['sass-globbing', 'susy']
                },
                files: [{
                    'src/assets/default/sass/components/grid.scss': 'src/assets/default/sass/grid.scss',
                    'src/assets/default/sass/base/normalize/normalize.scss': 'src/assets/lib/vendor/normalize.css/normalize.css',
                    'src/assets/default/sass/components/magnific-popup/magnific-popup.scss': 'src/assets/lib/vendor/magnific-popup/dist/magnific-popup.css'
                }]
            },
            front: {
                options: {
                    bundleExec: true,
                    style: 'compressed', //nested
                    require: ['sass-globbing']
                },
                files: [{
                    'src/assets/default/styles/main.css': 'src/assets/default/sass/main.scss',
                    'src/assets/default/styles/ckeditor.css': 'src/assets/default/sass/ckeditor.scss'
                }]
            },
        },
        postcss: {
            options: {
                map: true, // inline sourcemaps
                processors: [
                    require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer-core')({
                        browsers: ['last 2 versions', 'ie 9']
                    }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ],
            },
            dist: {
                src: 'src/assets/default/styles/main.css'
            }
        },
        favicons: {
            options: {
                appleTouchBackgroundColor: "#ffffff",
                tileColor: "auto"
            },
            icons: {
                src: 'src/assets/default/images/icons/source.152x152.png',
                dest: 'src/assets/default/images/icons'
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: currentWorkingDirectory,
                    src: [
                        styleguidePath + 'scripts/**',
                        styleguidePath + 'images/**',
                        styleguidePath + 'styles/**',
                        styleguidePath + 'fonts/**'
                    ],
                    dest: styleguideDest
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-favicons');
    grunt.loadNpmTasks('grunt-postcss');

    // Default task(s).
    grunt.registerTask('base', ['sass:base']);
    grunt.registerTask('build', ['sass', 'postcss']);
    grunt.registerTask('front', ['sass:front', 'watch:front']);
    grunt.registerTask('browsersync', ['browserSync', 'watch:front', 'postcss']);
    grunt.registerTask('copyStyleguide', ['copy']);

};