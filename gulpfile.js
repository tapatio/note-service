const gulp = require('gulp')
const eslint = require('gulp-eslint')

const scripts = [
    '*.js',
    './**/*.js',
    '!coverage/**',
    '!data/**',
    '!installation/**',
    '!node_modules/**',
    '!test/**',
    '!tests/**',
    '!doc/**',
    '!jsdocs/**',
    '!app/**',
    '!migration/**'
]

gulp.task('lint', () => {
    return gulp.src(scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

gulp.task('default', gulp.series(['lint']))
