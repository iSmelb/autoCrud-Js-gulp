const gulp = require('gulp');
const connect = require('gulp-connect');
//const livereload = require('gulp-livereload')
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

gulp.task('webserver', () => {
    connect.server({
        livereload: true
      });
})

gulp.task('html', () => {
    return gulp.src('./index.html')
    .pipe(connect.reload())
})

gulp.task('sass', () => {
    return gulp.src('./src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(connect.reload())
})

gulp.task('babel', () => {
    return gulp.src([
        './src/js/functions/*.js',
        './src/js/classes/*.js',
        './src/js/data/data.js',
        './src/js/app.js',
    ])
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(concat('./build.js'))
    .pipe(gulp.dest('./public/build'))
    .pipe(connect.reload())
})

gulp.task('watch', () => {
    gulp.watch(['./src/scss/**/*.scss', './src/js/**/*.js'], gulp.parallel('sass','babel'))
    gulp.watch('./**/index.html',  gulp.parallel('html'))
});

gulp.task('default', gulp.parallel('watch', 'webserver'))