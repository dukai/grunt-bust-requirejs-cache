/*
 * grunt-bust-requirejs-cache
 * https://github.com/dukai/grunt-bust-requirejs-cache
 *
 * Copyright (c) 2015 DK
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var baseUrl = (grunt.config.get('requirejs').compile.options.baseUrl.trim('/'));
  var appDir = (grunt.config.get('requirejs').compile.options.appDir.trim('/'));

  var srcUrl = appDir + "/" + baseUrl;

  grunt.log.writeln(srcUrl);


  grunt.registerMultiTask('bust_requirejs_cache', 'Bust Require.js module file cache.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      //src += options.punctuation;
	  var regExp = /require\(\[(([\'\"][\w-\/]+[\'\"],*\s*)+)\]/ig;
	  var requireMatches = src.match(regExp);



	  requireMatches.forEach(function(value){
      var exp = /(?:['"])([\w-\/]+)(?:['"])/ig;
      value.replace(exp, function($0, $1){
        if(!/\.js$/.test($1)){


          var filepath = path.join(srcUrl, $1) + '.js';
          grunt.log.writeln(filepath);
        }
      });
	  });

	  grunt.log.writeln(requireMatches);

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
