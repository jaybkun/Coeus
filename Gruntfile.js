module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        jshint: {
            options: {
                globals: {
                    angular: true,
                    jquery: true
                }
            },
            server: ['server.js', 'routes/**/*.js'],
            client: ['public/javascripts/**/*.js', 'public/routes/**/*.js', '!public/javascripts/THREEx.*'],
            tests: ['karma.conf.js', 'tests/**/*.js'],
            gruntfile: ['Gruntfile.js']
        },
        watch: {
            server: {
                files: ['<%= jshint.server %>'],
                tasks: ['jshint:server']
            },
            client: {
                files: ['<%= jshint.client %>'],
                tasks: ['jshint:client', 'includeSource']
            },
            tests: {
                files: ['<%= jshint.tests %>'],
                tasks: ['jshint:tests']
            },
            gruntfile: {
                files: ['<%= jshint.gruntfile %>'],
                tasks: ['jshint:gruntfile']
            }
        },
        includeSource: {
            options: {
                basePath: 'public',
                html: {
                    js: '<script src="{filePath}" type="text/javascript">'
                }
            },
            default: {
                files: {
                    'public/index.html': 'public/index.tmpl.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-include-source');

    grunt.registerTask('default',['compass', 'includeSource']);
};
