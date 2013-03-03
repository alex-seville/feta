module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      options: {
      },
      build: {
        src: 'lib/feta.js',
        dest: 'tmp/feta.min.js'
      }
    },
    stringify: {
      feta:{
        options: {
          header: "var fetaStr=\"",
          footer: "\";\n//@ sourceURL=feta.js"
        },
        files:{
          "tmp/feta.min.str.js": "tmp/feta.min.js"
        }
      }
    },
    concat:{
      new_devtools: {
        options: {
          separator: '\n;\n'
          
        },
        files: {
          'dist/devtools.js': ['extension/devtools.js', 'tmp/feta.min.str.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          {src: ['extension/background.js'], dest: 'dist/background.js', filter: 'isFile'},
          {src: ['extension/devtools.html'], dest: 'dist/devtools.html', filter: 'isFile'},
          {src: ['extension/manifest.json'], dest: 'dist/manifest.json', filter: 'isFile'},
          {src: ['extension/Panel.html'], dest: 'dist/Panel.html', filter: 'isFile'},
          {src: ['extension/panel.js'], dest: 'dist/panel.js', filter: 'isFile'},
          {expand: true,cwd: 'extension/css/', src: ['*'], dest: 'dist/css/'},
          {expand: true,cwd: 'extension/images/', src: ['*.png'], dest: 'dist/images/'}
          ]
      }
    },
    watch: {
      scripts: {
        files: ['extension/**/*','lib/*'],
        tasks: ['default'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify','stringify','concat','copy','watch']);

};