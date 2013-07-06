module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-mocha');

  var PORT = 8899;

  var auraRequireBaseConfig = {
    options: {
      baseUrl: '.',
      paths: {
        aura: 'lib',
        jquery: 'empty:',
        underscore: 'empty:',
        eventemitter: 'components/eventemitter2/lib/eventemitter2'
      },
      shim: {
        underscore: {
          exports: '_'
        }
      },
      include: [
        'aura/aura',
        'aura/aura.extensions',
        'aura/ext/debug',
        'aura/ext/mediator',
        'aura/ext/widgets'
      ],
      exclude: ['jquery']
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: PORT,
          base: '.'
        }
      }
    },
    requirejs: {
      dev: grunt.util._.merge({}, auraRequireBaseConfig, {
        options: {
          optimize: 'none',
          paths: {
            aura: 'lib',
            jquery: 'empty:',
            underscore: 'empty:',
            eventemitter: 'components/eventemitter2/lib/eventemitter2'
          },
          shim: {
            underscore: {
              exports: '_'
            }
          },
          include: [
            'aura/aura',
            'aura/aura.extensions',
            'aura/ext/debug',
            'aura/ext/mediator',
            'aura/ext/components'
          ],
          exclude: ['jquery'],
          out: 'dist/aura.js'
        }
      }
    },
    yuidoc: {
      compile: {
        name: "<%= pkg.name %>",
        description: "<%= pkg.description %>",
        version: "<%= pkg.version %>",
        url: "<%= pkg.homepage %>",
        options: {
          paths: [ "lib" ],
          outdir: "docs",
          parseOnly: true
        }
      }
    },
    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [
            'lib/**/*.js',
            'spec/lib/**/*.js'
          ]
        }
      }
    },
    mocha: {
      all: {
          options: {
              urls: ['http://localhost:<%= connect.server.options.port %>/spec/index.html']
          }
      }
    },
    watch: {
      files: [
        'lib/**/*.js',
        'spec/lib/**/*.js'
      ],
      tasks: ['spec']
    }
  });

  grunt.registerTask('spec', ['jshint', 'connect', 'mocha']);
  grunt.registerTask('build', ['spec', 'requirejs','dox']);
  grunt.registerTask('default', ['spec', 'watch']);
};
