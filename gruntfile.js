module.exports = function(grunt) {

    // Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dev: {
                options: {
                    style: 'compressed',
                    lineNumbers: false,
                    // add to the list of paths to prepend to SASS @import functions
                    loadPath: [
                        'node_modules',
                        'src/sass'
                    ]   
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass/',
                    src: ['main.scss'],
                    dest: 'dist/assets/css/',
                    ext: '.css'
                }]
            }
        },
        // ahoy! complicated stuff ahead!
        // https://github.com/TypeStrong/tsify/issues/92
        // convert TS to ES6 (tsify), then ES6 to ES5 with Babel (babelify)
        // THEN bundle the JS modules together using Browserify
        // we then minify the bundle separately with uglify and
        // output to dist
        browserify: {
            options: {
                plugin: [
                    ['tsify', { target: 'es2016' }],
                ],
                transform: ['babelify'],
                extensions: ['.js', '.ts']
            },
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: ['src/js/main.ts'],
                dest: 'src/js/bundle.js'
            }   
        },
        uglify: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'dist/assets/js/main.min.js': ['src/js/bundle.js']
                }
            }
        },
        watch: {
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true // re-initialize grunt to apply changes
                }
            },
            sass: {
                files: [
                    'src/sass/**/*.scss',
                    'src/components/**/*.scss'
                ],
                tasks: ['sass'],
                options: {
                    spawn: true // forces watch to bail out completely on an error
                }
            },
            ts: {
                files: [
                    'src/js/**/*.ts'
                ],
                tasks: ['browserify'],
                options: {
                    spawn: true
                }
            },
            js: {
                files: [
                    'src/js/bundle.js'
                ],
                tasks: ['uglify'],
                options: {
                    spawn: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify'); 
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('compile-js', ['browserify:dev', 'uglify:dev']);
};