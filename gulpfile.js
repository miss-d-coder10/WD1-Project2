const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const nodemon    = require("gulp-nodemon");


gulp.task('es6', () => {
    return gulp.src('public/js/src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(concat('main.js'))
        .pipe(gulp.dest('public/js/dist'));
});

gulp.task('sass', function() {
    return gulp.src('public/styles/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/styles/'));
});

gulp.task('compress', function() {
    return gulp.src('public/js/dist/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/dist/'));
});

gulp.task('minify-css', function() {
    return gulp.src('public/styles/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/styles/'));
});

gulp.task('nodemon', () => {
  return nodemon({
    script: 'app.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task("watch", () => {
	livereload.listen();
  gulp.watch('public/js/src/**/*.js', ['es6']);
  gulp.watch('public/styles/sass/**/*.scss', ['sass']);
});

gulp.task("default", [
  'watch',
  'nodemon'
]);
