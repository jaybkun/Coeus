(function() {
    'use strict';

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
            watch: {
                scripts: {
                    files: ['public/**/*.js]'],
                    tasks: ['default'],
                    options: {
                        spawn: false
                    }
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
        grunt.loadNpmTasks('grunt-contrib-compass');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-include-source');

        grunt.registerTask('default',['compass', 'includeSource']);
    };
})();
