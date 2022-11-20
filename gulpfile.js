import gulp from 'gulp';
import browserSync from 'browser-sync';
import sasscomp from 'sass';
import gulpsass from 'gulp-sass';

const sass = gulpsass(sasscomp);

import concat from 'gulp-concat';
import cleancss from 'gulp-clean-css';

const bsInstance = browserSync.create();
const outputPath = './dist';

function browsersync() {
    bsInstance.init({
        server: {baseDir: outputPath},
        notify: false,
        online: false
    })
}

function pages() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());
}

function styles() {
    return gulp.src('app/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(outputPath))
        .pipe(concat('styles.min.css'))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
        .pipe(gulp.dest(outputPath))
        .pipe(bsInstance.stream());   
}

function images() {
    return gulp.src(['app/img/*.png', 'app/img/*.svg', 'app/img/*.jpg'])
        .pipe(gulp.dest(outputPath+'/img'))
}

function startwatch() {
    gulp.watch('app/*.html').on('change', () => {
        pages();
        images();
        bsInstance.reload();
    });
    gulp.watch('app/*.scss').on('change', () => {
        styles();
        images();
        bsInstance.reload();
    });
}

const build = gulp.series(gulp.parallel(pages, styles, images));
const serve = gulp.series(build, gulp.parallel(browsersync, startwatch));

export {
    build,
    serve
}

export default build;
