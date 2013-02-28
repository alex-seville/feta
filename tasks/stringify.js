/*
 * grunt-contrib-imagemin
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Sindre Sorhus, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    

    grunt.registerMultiTask('stringify', 'Render a script to string', function () {
        var options = this.options({
            header: "",
            footer: ""
        });
        

        grunt.verbose.writeflags(options, 'Options');

        grunt.util.async.forEach(this.files, function (files, next) {
            files.src.forEach(function (src) {
                var dest = files.dest;
                var srcStr = grunt.file.read(src).replace(/\\/g,"\\\\").replace(/"/g,'\\"');
                grunt.file.write(dest,options.header+srcStr+options.footer);
            });
            next();
        }.bind(this), this.async());

        
    });
};