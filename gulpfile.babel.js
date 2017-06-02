import gulp from 'gulp';
import watch from 'gulp-watch';
import del from 'del';
import concatCss from 'gulp-concat-css';
import autoprefixer from 'gulp-autoprefixer';
import minifyCss from 'gulp-minify-css';
import ts from 'gulp-typescript';
import browserSync from 'browser-sync';
import series from 'stream-series';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';


//Reloading server on change.
let reload = browserSync.reload;

//Dependencies for our application 
let jsDependencys = [
    './node_modules/jquery/dist/jquery.js',
    './app/js/lib/jquery-jvectormap-2.0.3.min.js',
    './app/js/lib/jquery-jvectormap-se-merc.js'
];

let staticFiles = [
    './app/img/**/*',
    './app/*.html',
    './app/js/*.json',
    './app/audio/*'
];


gulp.task('jsdependencies', () => {
    return series(
        gulp.src(jsDependencys[0]),
        gulp.src(jsDependencys[1]),
        gulp.src(jsDependencys[2])
    )
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(reload({ stream: true }));
});


gulp.task('copy', () => {
    return gulp.src(staticFiles, { base: './app/' })
        .pipe(gulp.dest('dist'))
        .pipe(reload({ stream: true }));
});

gulp.task('js', () => {
    return gulp.src('./app/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/js"))
        .pipe(reload({ stream: true }));
});

gulp.task('css', function () {
    return gulp.src(['./app/css/**/*.css'])
        .pipe(minifyCss())
        .pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({ stream: true }));
});


gulp.task('watch', ['css', 'copy', 'jsdependencies', 'js'], () => {
    browserSync.init({
        injectChanges: true,
        notify: true,
        server: {
            baseDir: "./dist"
        }

    });

    watch(staticFiles, () => {
        gulp.start('copy');
    });

    watch(['./app/css/*.css'], () => {
        gulp.start('css');
    });

    watch(['./app/js/*.js'], () => {
        gulp.start('js');
    });

});

//Clean (delete) dist folder
gulp.task('clean', () => {
    return del('dist');
});

//Default task = watch
gulp.task('default', ['watch']);