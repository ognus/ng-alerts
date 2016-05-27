var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var Server = require('karma').Server;

function runTests(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done).start();
}

function build() {
  return gulp.src('src/templates/**/*.html')
    // minify templates and add them to $templateCache
    .pipe(plugins.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
    }))
    .pipe(plugins.angularTemplatecache({
      module: 'og-alerts.templates',
      standalone: true,
    }))

    // add all JS sources
    .pipe(plugins.addSrc([
      'src/js/**/*.js',
      '!src/js/**/module.js'
    ]))

    .pipe(plugins.addSrc.prepend('src/js/**/module.js'))

    // run linter to check JS files
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())

    // merge all files to single file
    .pipe(plugins.concat('og-alerts.js'))

    // wrap with Universal Module Definition
    .pipe(plugins.umd({ template: 'src/umd.templ.js' }))

    // save to dist directory
    .pipe(gulp.dest('./dist'))

    // create minified version and save to dist directory
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({ preserveComments: 'license' }))
    .pipe(plugins.rename('og-alerts.min.js'))
    .pipe(gulp.dest('./dist'));
}

/**
* Build task
*/
gulp.task('build', build);

/**
 * Test task
 */
gulp.task('test', ['build'], runTests);


/**
 * Watch task
 */
gulp.task('watch', ['test'], function () {
  plugins.watch(['src/**/*', 'tests/**/*.js'], plugins.batch(function (events, done) {
    build().on('end', function () {
      runTests(done);
    });
  }));
});

gulp.task('default', ['watch']);
