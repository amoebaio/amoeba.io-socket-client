module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            build: {
                src: 'build/amoeba.io-socket-client.js',
                dest: 'build/amoeba.io-socket-client.min.js'
            }
        },
        browserify: {
            dist: {
                files: {
                    'build/amoeba.io-socket-client.js': ['lib/amoeba-socket-client.js'],
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify']);

};
