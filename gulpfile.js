var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');

gulp.task('default', ['build'], function () {
});

gulp.task('build', function () {
  return gulp.src('assets/js/**/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('release/assets/js/'));
});