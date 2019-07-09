/// <binding />
/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    es = require('event-stream'),
    bowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    jshintTeamcity = require('jshint-teamcity'),
    bower = require('./bower'),
    gutil = require('gulp-util'),
    karmaServer = require('karma').Server,
    argv = require('yargs').argv,
    replace = require('gulp-replace'),
    isWatching = false;

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

/**
 * 
 * JS Hint
 */
gulp.task('jshint', function () {
  return gulp.src([
    './app/**/*.js',
    '!./app/**/*tests.js',
    '!./app/bower_components/**/*',
    '!./app/*-templates.js'
  ])
    .pipe(g.cached('jshint'))
    .pipe(jshint('./.jshintrc'));
});

/**
 * CSS
 */
gulp.task('clean-css', function (done) {
  rimraf('./.tmp/css', done);
});

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './app/**/*.scss',
    '!./app/**/_*.scss'
  ])
    .pipe(g.sass())
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(gulp.dest('./app/css/'))
    .pipe(g.cached('built-css'));
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('csslint', ['styles'], function () {
  return cssFiles()
    .pipe(g.cached('csslint'))
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter());
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', bower.name, {ngAnnotate: true}));
});

/**
 * Templates
 */
gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({min: true}).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
  var files = bowerFiles();
  var vendorJs = fileTypeFilter(files, 'js');
  var vendorCss = fileTypeFilter(files, 'css');
  var q = new queue({objectMode: true});
  if (vendorJs.length) {
    q.queue(gulp.src(vendorJs).pipe(dist('js', 'vendors')));
  }
  if (vendorCss.length) {
    q.queue(gulp.src(vendorCss).pipe(dist('css', 'vendors')));
  }
  return q.done();
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates', 'vendor'], index);

function index () {
    var opt = { read: false };
  return gulp.src('./index.html')
    .pipe(g.inject(gulp.src(bowerFiles(), opt), {addPrefix: 'app', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {addPrefix: 'app', ignorePath: ['.tmp', 'app']}))
    .pipe(gulp.dest('./'))
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/'));
}

gulp.task('vendor', function() {  
  return gulp.src('./bower_components/**')
    .pipe(gulp.dest('./app/bower_components'));
});

/**
 * Assets
 */
gulp.task('assets', function () {
  return gulp.src('./app/assets/**')
    .pipe(gulp.dest('./dist/assets'));
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), {ignorePath: 'dist'}))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Watch
 */
gulp.task('serve', ['watch']);
gulp.task('watch', ['default'], function () {
  isWatching = true;
  gulp.watch('./app/**/*.js', ['jshint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
    }
  });
  //gulp.watch('./Views/Home/Index.cshtml', ['index']);
  gulp.watch(['./app/**/*.html', '!./index.html'], ['templates']).on('change', function (evt) {
      if (evt.type == 'changed') {
      }
  });
  gulp.watch(['./app/**/*.scss'], ['csslint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    } else {
    }
  });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'config-api', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint']);

/**
 * Test
 */
gulp.task('test', ['templates'], function (done) {
  var reporters = argv.teamcity ? 'teamcity' : 'spec';
  new karmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    reporters: reporters
  }, done).start();
});

/**
 * Config API   'http://localhost/IRIS.Api3/'; 'https://apitest.consumerprotectionbc.ca/';
 */
gulp.task('config-api', function () {
    var apiUrl = 'https://apitest.consumerprotectionbc.ca/';

    switch (argv.config) {
        case 'test':
            apiUrl = 'https://apitest.consumerprotectionbc.ca/';
            break;
        case 'production':
            apiUrl = 'https://api.consumerprotectionbc.ca/';
            break;
    }

    gulp.src(['./app/app.js'])
      .pipe(replace(/(apiServiceBaseUri: ').*(',)/g, '$1' + apiUrl + '$2'))
      .pipe(gulp.dest('./app/'));
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates'], function () {
  return gulp.src('./karma.conf.js')
    .pipe(g.inject(testFiles(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function (filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));
});

/**
 * Test files
 */
function testFiles() {
  return new queue({objectMode: true})
    .queue(gulp.src(fileTypeFilter(bowerFiles(), 'js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(gulp.src('./bower_components/chai-spies/chai-spies.js'))
    .queue(gulp.src('./node_modules/chai-angular/chai-angular.js'))
    .queue(appFiles())
    .queue(gulp.src(['./app/**/*tests.js', './.tmp/app/**/*tests.js', '!**/bower_components/**/*']))
    .done();
}

/**
 * All CSS files as a stream
 */
function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles () {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './.tmp/app/**/*.js',
    '!./.tmp/app/**/*tests.js',
    './app/**/*.js',
    '!./app/**/*tests.js',
    '!./app/bower_components/**/*'
  ];
  return gulp.src(files)
    .pipe(g.angularFilesort());
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles (opt) {
  return gulp.src(['./app/**/*.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates () {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name,
      prefix: '/' + bower.name + '/',
      stripPrefix: '/app'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(gulp.dest, './app')();
}

/**
 * Filter an array of files according to file type
 *
 * @param {Array} files
 * @param {String} extension
 * @return {Array}
 */
function fileTypeFilter (files, extension) {
  var regExp = new RegExp('\\.' + extension + '$');
  return files.filter(regExp.test.bind(regExp));
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.cleanCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

/**
 * Jshint with stylish reporter
 */
function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, jshintTeamcity)
    .pipe(g.jshint.reporter, stylish)();
}