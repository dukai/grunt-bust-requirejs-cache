/*
 * grunt-bust-requirejs-cache
 * https://github.com/dukai/grunt-bust-requirejs-cache
 *
 * Copyright (c) 2015 DK
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var util = require('util');
var crypto = require('crypto');
var fs = require('fs');

var ignoreMatch = function(src, patterns) {
    for (var i = 0, len = patterns.length; i < len; i++) {
        if (src.search(patterns[i]) != - 1) {
            return true;
        }
    }
    return false;
}

var getHash = function(fileContent, isShort){
    var shasum = crypto.createHash('md5');
    var hash = shasum.update(fileContent).digest('hex');
    if(isShort){
        return hash.substr(8, 16);
    }
    return hash;
}

module.exports = function(grunt) {

    var baseUrl = (grunt.config.get('requirejs').compile.options.baseUrl.trim('/'));
    var appDir = (grunt.config.get('requirejs').compile.options.appDir.trim('/'));

    var resourceMap = {};

    grunt.registerMultiTask('bust_requirejs_cache', 'Bust Require.js module file cache.', function() {
        //grunt.log.writeln(util.inspect(this.files));

        var options = this.options({baseUrl: 'js', shortHash: false});
        var srcUrl = options.appDir + "/" + baseUrl;
        grunt.log.debug("src url: " + srcUrl);


        //grunt.log.writeln(util.inspect(options));

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            var src = '';

            if (!grunt.file.exists(f.src[0])) {
                //grunt.log.warn('Source file "' + f.src[0] + '" not found.');
                return;
            } else {
                src = grunt.file.read(f.src[0]);
            }

            var filepath = f.src[0];

            var ext = path.extname(filepath);

            if(ext == '.js'){
                var moduleName = filepath.replace(options.appDir + path.sep + options.baseUrl + path.sep, '').replace('.js', '');
                if(resourceMap[moduleName]){
                    return;
                }

                moduleName = moduleName.replace(srcUrl + '/', '');

                var fileContent = grunt.file.read(filepath);

                var hash = getHash(fileContent, options.shortHash);

                var moduleName = resourceMap[moduleName] = moduleName + '.' + hash;

                fs.renameSync(filepath, filepath.replace('.js', '.' + hash + '.js'));

            }else{
            
                var regExp = /require\(\[(([\'\"][\w-\/]+[\'\"],*\s*)+)\]/ig;
                var requireMatches = src.match(regExp);

                var hashedMatches = [];

                if (requireMatches) {
                    hashedMatches = requireMatches.map(function(value) {
                        var exp = /(['"])([\w-\/]+)(['"])/ig;
                        var result = value.replace(exp, function($0, $1, moduleName, $3) {
                            if (!/\.js$/.test(moduleName) && ! ignoreMatch(moduleName, options.ignorePatterns)) {
                                //如果已经加过指纹，直接返回
                                if(resourceMap[moduleName]){
                                    return $1 + resourceMap[moduleName] + $3;
                                }

                                var filepath = path.join(srcUrl, moduleName) + '.js';
                                // grunt.log.debug(filepath);


                                if(!grunt.file.exists(filepath)){
                                    grunt.log.warn('target file "' + filepath + '" not found');
                                    return $1 + moduleName + $3;
                                }
                                var fileContent = grunt.file.read(filepath);

                                var hash = getHash(fileContent, options.shortHash);

                                // var newFileContent = fileContent.replace(moduleName, moduleName + "." + hash);
                                // grunt.file.write(filepath, fileContent);

                                var moduleName = resourceMap[moduleName] = moduleName + '.' + hash;

                                // grunt.log.debug(filepath);

                                fs.renameSync(filepath, filepath.replace('.js', '.' + hash + '.js'));
                                //grunt.log.writeln(hash);
                            }

                            return $1 + moduleName + $3;
                        });
                        //grunt.log.writeln(result);
                        return result;
                    });

                    // grunt.log.debug(hashedMatches);
                }

                var dataRegExp = /data-widget="(.+?)"/ig;
                var result;

                while((result = dataRegExp.exec(src)) != null){
                    var moduleName = result[1];
                    if (!/\.js$/.test(moduleName) && ! ignoreMatch(moduleName, options.ignorePatterns)) {
                        //如果已经加过指纹，直接返回
                        if(resourceMap[moduleName]){
                            continue;
                        }

                        var filepath = path.join(srcUrl, moduleName) + '.js';
                        // grunt.log.debug(filepath);


                        if(!grunt.file.exists(filepath)){
                            grunt.log.warn('target file "' + filepath + '" not found');
                            return $1 + moduleName + $3;
                        }
                        var fileContent = grunt.file.read(filepath);

                        var hash = getHash(fileContent, options.shortHash);

                        // var newFileContent = fileContent.replace(moduleName, moduleName + "." + hash);
                        // grunt.file.write(filepath, fileContent);

                        var moduleName = resourceMap[moduleName] = moduleName + '.' + hash;

                        // grunt.log.debug(filepath);

                        fs.renameSync(filepath, filepath.replace('.js', '.' + hash + '.js'));
                        //grunt.log.writeln(hash);
                    }   
                }
            }



            // Write the destination file.
            // grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" bust.');
        });

        var resourceMapFileContent = JSON.stringify(resourceMap);
        // grunt.log.debug(resourceMapFileContent);

        //获取requirejs cache bust生成的js模块的source map
        var rsconfigPath = this.options().dist + '/js/rs-config.js';
        // var resourceMap = grunt.file.read(this.options().dist + '/resource-map.json');
        var modulePath = 'requirejs.config({"paths": ' + resourceMapFileContent + "});";
        var rsConfig = grunt.file.read(rsconfigPath);

        grunt.file.write(rsconfigPath, rsConfig + modulePath);
        grunt.log.writeln("update rs-config.js");
        var rsconfigHash = getHash(rsConfig + modulePath, options.shortHash);
        fs.renameSync(rsconfigPath, rsconfigPath.replace('.js', '.' + rsconfigHash + '.js'));

        resourceMap['rs-config'] = 'rs-config.' + rsconfigHash;
        grunt.file.write(options.appDir + '/resource-map.json', JSON.stringify(resourceMap));

        this.files.forEach(function(f){
            
            var filename = f.src[0];

            if(path.extname(filename) == '.html'){
                var src = '';

                if (!grunt.file.exists(f.src[0])) {
                    grunt.log.warn('Source file "' + f.src[0] + '" not found.');
                } else {
                    src = grunt.file.read(f.src[0]);
                }

                var src = src.replace(/rs-config/ig, 'rs-config.' + rsconfigHash);

                grunt.file.write(f.dest, src);
            }

        });
    });

};

