var path = require('path');
module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            src: {
                files: ['**/*.scss', '**/*.php', '*.php', '**/**/*.scss',],
                tasks: ['compass']
            },
            options: {
                livereload: true
            },
            js: {
                files: "js/theme.js",
                tasks: ['uglify']
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: 'assets',
                    cssDir: path.resolve(),
                    imagesDir: 'images',
                    javascriptsDir: 'js',
                    fontsDir: 'assets/fonts',
                    outputStyle: 'compact',
                    relativeAssets: false,
                    noLineComments: true,
                    debugInfo: false
                }
            }
        },

        uglify: {
            build: {

                files: {
                    'js/theme.min.js': ['js/theme.js']
                }

            }
        }
    });

    /* instead of grunt.loadNpmTasks(); */
    require('load-grunt-tasks')(grunt);
    grunt.registerTask("default", ['watch', 'compass', 'uglify']);
	grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
};