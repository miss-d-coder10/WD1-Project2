const gulp  = require("gulp");
const babel = require("gulp-babel");

gulp.task('es6', () => {
 return gulp.src('public/js/src/client.js')
   .pipe(babel({
     presets: ['es2015']
   }))
   .pipe(gulp.dest('public/js/dist'));
});

gulp.task('default', ['es6'], () => {
 gulp.watch('public/js/src/client.js', ['es6']);
});
