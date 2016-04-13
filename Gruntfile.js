/*
 * grunt-bust-requirejs-cache
 * https://github.com/dukai/grunt-bust-requirejs-cache
 *
 * Copyright (c) 2015 DK
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var config = {
		webroot: 'test',
		dist: 'tmp',
		testroot: 'test',
		tstamp: '<%= grunt.template.today("ddmmyyyyhhMMss") %>'
	};
	// Project configuration.
	grunt.initConfig({
		config: config,
		jshint: {
			all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'test',
					src: ['js/**', 'page/**'],
					dest: 'tmp/'
				},
				]
			}
		},

		requirejs: {
			compile: {
				options: {
					appDir: '<%= config.testroot %>',
					baseUrl: "js",
					dir: '<%= config.dist %>',
					mainConfigFile: '<%= config.webroot %>/js/rs-config.js',
					optimize: 'none',
					skipDirOptimize: true,
					modules: [{
						name: 'rs-config',
						include: ['jquery', 'rs-config']
					},

					{
						name: 'app/page-main',
						exclude: ['rs-config']
					},
					{
						name: 'app/page-sub',
						exclude: ['rs-config']
					}]
				}
			}
		},

		// Configuration to be run (and then tested).
		bust_requirejs_cache: {
			default_options: {
				options: {
					appDir: '<%= config.dist%>',
					dist: '<%= config.dist%>',
					ignorePatterns: ['jquery', 'rs-config']
				},
				files: [{
					expand: true,
					cwd: '<%= config.dist %>',
					src: ['page/**/*.html', 'js/app/**/*.js'],
					dest: '<%= config.dist%>'
				}]
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'copy', 'bust_requirejs_cache']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};

