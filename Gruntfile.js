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
          header: "var fetaStr=\"if (!window.feta){",
          footer: "}\";\n//@ sourceURL=feta.js"
        },
        files:{
          "tmp/feta.min.str.js": "tmp/feta.min.js"
        }
      }
    },
    concat:{
      new_devtools: {
        options: {
          separator: '\n',
          banner: '<%= fetaSourceHeader %>\n',
          footer: '\n<%= fetaSourceFooter %>'
        },
        files: {
          'dist/devtoolsjs/fetaSource.js': ['extension/devtoolsjs/fetaSource.js', 'tmp/feta.min.str.js']
        }
      }
    },
    fetaSourceHeader: "(function(root){",
    fetaSourceFooter: "})(window);",
    copy: {
      main: {
        files: [
          {src: ['extension/background.js'], dest: 'dist/background.js', filter: 'isFile'},
          {src: ['extension/devtools.js'], dest: 'dist/devtools.js', filter: 'isFile'},
          {src: ['extension/devtools.html'], dest: 'dist/devtools.html', filter: 'isFile'},
          {src: ['extension/manifest.json'], dest: 'dist/manifest.json', filter: 'isFile'},
          {src: ['extension/Panel.html'], dest: 'dist/Panel.html', filter: 'isFile'},
          {src: ['extension/panel.js'], dest: 'dist/panel.js', filter: 'isFile'},
          {src: ['components/jquery/jquery.js'], dest: 'dist/js/jquery.js', filter: 'isFile'},
          {expand: true,cwd: 'extension/css/', src: ['*'], dest: 'dist/css/'},
          {expand: true,cwd: 'extension/js/', src: ['*.js'], dest: 'dist/js/'},
          {expand: true,cwd: 'extension/devtoolsjs/', src: ['*.js'], dest: 'dist/devtoolsjs/'},
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
    },
    qunit: {
      all: ['test/**/*.html']
    }
  });

  grunt.loadTasks('tasks');

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  // Default task(s).
  grunt.registerTask('default', ['qunit','uglify','stringify','copy','concat','watch']);
};