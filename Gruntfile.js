'use strict';

module.exports = function(grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';\n'
			},
			dist: {
				src: ['public/src/bower_components/jquery/dist/jquery.min.js',
					  'public/src/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
					  'public/src/js/app.js'],
				dest: 'public/dist/js/app.js'
			}
		},

		sass: {
			build: {
				files: {
					'public/dist/css/main.css': 'public/src/css/main.scss'
				}
			}
		},

		watch: {
			js: {
				files: ['public/src/js/*.js'],
				tasks: ['concat']
			},
			css: {
				files: ['public/src/css/*.scss'],
				tasks: ['sass']
			}
		},

		nodemon: {
			dev: {
				script: 'server.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('default', ['concat', 'sass']);
	grunt.registerTask('dev', ['nodemon', 'watch']);
};