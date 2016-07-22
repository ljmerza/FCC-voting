'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    cssnano = require('gulp-cssnano'),
    babel = require('gulp-babel'),
    notify = require("gulp-notify"),
    ejs = require("gulp-ejs"),
    merge = require('merge-stream'),
    htmlmin = require('gulp-htmlmin'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps')



//Javascript tasks
gulp.task('javascript', () => {
    return gulp.src([
        './public/js/jQuery/*.js',
        './public/js/jQuery Libraries/**/*.js',
        "./public/js/materialize/*.js",
        './public/js/*.js'
        ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    // .pipe(babel({
    //     presets: ['es2015'],
    //     plugins: ['transform-runtime']
    // }))
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Javascript build done' }))
})





// Sass tasks
gulp.task('sass', () => {
    let sassStream = gulp.src([
        "./public/sass/materialize/materialize.scss", "./public/sass/*.s*ss"
    ])
    .pipe(sass({
    	style: 'compressed'
    },
    function (err) {
        return console.log(err)
    }))

    let cssStream = gulp.src('./public/sass/*.css')
        
    return merge(sassStream, cssStream)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Sass build done.' }))
})




// HTML tasks
gulp.task('html', () => {
    return gulp.src('./public/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/dist/'))
    .pipe(browserSync.reload({stream:true})) 
    .pipe(notify({ message: 'html build done.' }))                          
})



// image tasks
gulp.task('images', () => {
    return gulp.src('./public/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/dist/img/'))
    .pipe(browserSync.reload({stream:true})) 
    .pipe(notify({ message: 'images build done.' }))   
})





// Node-sync task
gulp.task('nodemon', () => {
    nodemon({
        script: 'dev-server.js',
        ignore: ['./gulpfile.js','./node_modules','./db', './public']
    })
    .on('restart', () => {
        setTimeout(() =>  {
            browserSync.reload({ stream: false })
        }, 1000)
    })
})

// Browser-sync task
gulp.task('browser-sync', ['nodemon'], () => {
    browserSync.init({
        proxy: "localhost:3000",
        port: 5000,
        notify: true
    })
})




// Watch tasks
gulp.task('watch', () => {
    gulp.watch('./public/*.html', ['html'])
    gulp.watch('./public/js/**/*.js', ['javascript'])

    gulp.watch('./public/sass/*.s*ss', ['sass'])
    gulp.watch('./public/sass/materialize/materialize.scss', ['sass'])
    
    gulp.watch('./public/img/*.*', ['images'])
    

})

// Default task
gulp.task('default', ['browser-sync', 'watch', 'sass', 'javascript', 'html', 'images'])


