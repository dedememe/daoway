//引入gulp模块
var gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');
const livereload = require('gulp-livereload');
const open = require('open');
const connect = require('gulp-connect');
//定义默认任务
// gulp.task('jshint', function () {
//   return gulp.src('src/js/*.js')
//     .pipe(jshint({esversion: 6}))
//     .pipe(jshint.reporter('default'));
// });
//
// gulp.task('babel', ['jshint'], function () {
//   return gulp.src('src/js/*.js')
//     .pipe(babel({
//       presets: ['es2015']
//     }))
//     .pipe(gulp.dest('./build/js'))
// });//异步执行
//
// gulp.task('concat', ['babel'], function () {
//   return gulp.src(['./build/js/module1.js', './build/js/module2.js'])//避免重复合并
//     .pipe(concat('built.js'))
//     .pipe(gulp.dest('./build/js'))
// });

// gulp.task('minifyjs', ['concat'], function () {
//   return gulp.src('./build/js/built.js')
//     .pipe(uglify('dist.min.js'))
//     .pipe(gulp.dest('./dist/js'))
// });

gulp.task('minifyjs', function () {
  return gulp.src('./src/js/*.js')
    .pipe(jshint({esversion: 6}))
    .pipe(jshint.reporter('default'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./build/js'))
    .pipe(concat('built.js'))
    .pipe(gulp.dest('./build/js'))
    .pipe(uglify(''))
    .pipe(rename('dist.min.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(livereload())
});
gulp.task('minifycss', function () {
  return gulp.src('src/less/*.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('build/css'))//使用less将less文件转换为css
    .pipe(concat('built.css'))
    .pipe(gulp.dest('build/css'))//合并css文件
    .pipe(cssmin())//压缩css代码
    .pipe(rename('dist.min.css'))//重命名
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload())
});
gulp.task('minifyhtml', function () {
  return gulp.src('./src/index.html')
    .pipe(htmlmin({
      removeComments: true,//移除评论
      collapseWhitespace: true//删除空格
    }))
    // .pipe(rename('dist.min.html'))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload())
});

gulp.task('watch', ['default'], function () {
  livereload.listen();
  //配置热更新/热加载
  connect.server({
    root: 'dist',//访问目录
    livereload: true,
    port: 3000
  });
  open('http://localhost:3000');//自动打开网页的地址
  //配置监视任务
  gulp.watch('./src/js/*.js', ['minifyjs']);
  gulp.watch('./src/less/*.less', ['minifycss']);
  gulp.watch('./src/index.html', ['minifyhtml']);
});


gulp.task('default', ['minifyjs', 'minifycss', 'minifyhtml']);//异步执行，直接执行gulp就可以了