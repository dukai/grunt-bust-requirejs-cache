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
    webroot: 'src',
    dist: 'dist',
    testroot: 'test',
    tstamp: '<%= grunt.template.today("ddmmyyyyhhMMss") %>'
  };
  // Project configuration.
  grunt.initConfig({
    config: config,
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    requirejs: {
      compile: {
        options: {
          appDir: '<%= config.webroot %>',
          baseUrl: "js",
          dir: '<%= config.dist %>',
          mainConfigFile: '<%= config.webroot %>/js/rs-config.js',
          optimize: 'none',
          skipDirOptimize: true,
          modules: [
          {
            name: 'rs-config',
            include: [
            'jquery',
            'rs-config'
            ]
          },

          {
            name: 'app/page-main',
            exclude: ['rs-config']
          },
          {
            name: 'app/page-sub',
            exclude: ['rs-config']
          }
          ]
        }
      }
    },

    // Configuration to be run (and then tested).
    bust_requirejs_cache: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
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

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'bust_requirejs_cache']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
