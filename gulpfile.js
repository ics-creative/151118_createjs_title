"use strict";

const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const del = require("del");

// ファイル結合タスクを作成
gulp.task("uglify", () => {
  // 結合元のファイルを指定
  return gulp.src([
        "content/js/home.js",
        "content/js/archives.js",
        "content/js/perlin.js"])
      // JavaScriptファイルの圧縮
      .pipe(uglify())
      // 圧縮後の書き出し先
      .pipe(gulp.dest("content/js/temp/"));
});

// ファイル結合タスクを作成
gulp.task("concat-home", ["uglify"], () => {
  // 結合元のファイルを指定
  return gulp.src([
        "content/js/easeljs-0.8.2.min.js",
        "content/js/temp/perlin.js",
        "content/js/temp/home.js"])
      // 結合後のファイル名を指定
      .pipe(concat("home.js"))
      // 出力フォルダを指定
      .pipe(gulp.dest("content"));
});


gulp.task("clean", ["concat-home"], () => {
  del([
    // 削除するファイルの指定
    "content/js/temp"
  ]);
});

gulp.task("watch", () => {
  // 監視するファイルのパス
  gulp.watch("content/js/*.js", ["clean"]);
});


gulp.task("default", ["watch", "clean"])