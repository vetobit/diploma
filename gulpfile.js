var gulp          = require('gulp'),
    browserSync   = require('browser-sync').create(),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'),
    htmlmin       = require('gulp-htmlmin'),
    jsonminify    = require('gulp-jsonminify'),
    paths         = {
      js: ['js/*.js'],
      scss: ['scss/*.scss'],
      html:['*.html'],
      json:['json/*']
    };

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(uglify())
    .pipe(gulp.dest('../build/js'));
});
gulp.task('json', function () {
    return gulp.src(paths.json)
        .pipe(jsonminify())
        .pipe(gulp.dest('../build/json'));
});
gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
        }))
        .pipe(gulp.dest("../build/css"))
});
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('../build/'));
});
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./../build"
        }
    });
    gulp.watch("../build/**/*").on('change', browserSync.reload);
    gulp.watch("../build/*").on('change', browserSync.reload);
});
gulp.task('watch', function() {
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.json, ['json']);
});
gulp.task('default', ['watch', 'js', 'sass', 'html', 'json']);