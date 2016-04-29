var gulp          = require('gulp'),
    browserSync   = require('browser-sync').create(),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'),
    htmlmin       = require('gulp-htmlmin'),
    jsonminify    = require('gulp-jsonminify'),
    clean         = require('gulp-clean');
    paths         = {
      js: './src/js/*.js',
      scss: './src/scss/*.scss',
      html: './src/*.html',
      json: './src/json/*',
      nwjs: './nwjs/**/*',
      nwjsConfig: './src/nw-config/*',
      build: './build'
    };

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});
gulp.task('json', function () {
    return gulp.src(paths.json)
        .pipe(jsonminify())
        .pipe(gulp.dest('./build/json'));
});
gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(gulp.dest("./build/css"))
});
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build/'));
});
gulp.task('nwjs', function() {
  return gulp.src(paths.nwjs)
    .pipe(gulp.dest('./build/'));
});
gulp.task('nwjs-config', function() {
  return gulp.src(paths.nwjsConfig)
    .pipe(gulp.dest('./build/'));
});
gulp.task('clean', function () {
  return gulp.src(paths.build, {read: false})
    .pipe(clean());
});
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    gulp.watch("./build/**/*").on('change', browserSync.reload);
    gulp.watch("./build/*").on('change', browserSync.reload);
});
gulp.task('watch', function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.json, ['json']);
});
//gulp.task('default', ['clean', 'js', 'sass', 'html', 'json', 'nwjs-config', 'serve', 'watch', 'nwjs']);

gulp.task('default', ['clean'], function() {
    gulp.run(['js', 'sass', 'html', 'json', 'nwjs-config', 'serve', 'watch', 'nwjs']);
});