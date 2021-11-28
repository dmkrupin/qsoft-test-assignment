const gulp = require('gulp');
const sync = require('browser-sync').create();
const less = require('gulp-less');
const del = require("del");
const rename = require("gulp-rename");

// превращаем стили less в css
const styles = () => {
  return gulp.src("source/less/style.less")  //style.less
    // .pipe(plumber())                         //style.less(err->console)
    // .pipe(sourcemap.init())                  //style.less(capture1)
    .pipe(less())                            //style.less->style.css
    // .pipe(postcss([                          //style.css
    //   autoprefixer()                         //style.css(prefixed)
    // ]))
    // .pipe(csso())                            //style.css(prefixed, minified)
    // .pipe(rename("style.min.css"))           //style.min.css(prefixed, minified)
    // .pipe(sourcemap.write("."))              //style.min.css(prefixed, minified. capture2)
    .pipe(gulp.dest("build/css"))           //кладем в папочку build
    .pipe(sync.stream());
}
exports.styles = styles;

// запускаем сервер
const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}
exports.server = server;

// Reload
const reload = (done) => {
  sync.reload();
  done();
}
exports.reload = reload;

// Watcher
const watcher = () => {
  gulp.watch("source/**/*.less", gulp.series(styles, reload));
  gulp.watch("source/**/*.js", gulp.series(scripts, reload));
  gulp.watch("source/*.html", gulp.series(html, reload));
}
exports.watcher = watcher;

//Переносим скрипты в build
const scripts = () => {
  return gulp.src("source/**/*.js", { base: process.cwd() })
    .pipe(rename({
      dirname: "",
      // suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"));
}
exports.scripts = scripts;

//переносим html в build
const html = () => {
  return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
}
exports.html = html;

//Копируем картинки
const imagesCopy = () => {
  return gulp.src("source/img/**/*.{svg,png,jpg}")
    .pipe(gulp.dest("build/img"))
}
exports.imagesCopy = imagesCopy;

//Копируем шрифты
const fontsCopy = () => {
  return gulp.src("source/fonts/*.{woff2,woff,ttf}")
    .pipe(gulp.dest("build/fonts"))
}
exports.fontsCopy = fontsCopy;

//Чистим папку build
const clean = () => {
  return del("build");
}
exports.clean = clean;


//Собираем build - готовый проект
const build = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    imagesCopy,
    fontsCopy
  ),
);
exports.build = build;

//Собираем билд для разработки
exports.default = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    imagesCopy,
    fontsCopy
  ),
  gulp.series(
    server,
    watcher
  )
);
