var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');

var NwBuilder = require('nw-builder');

var bases = {
    app: 'build/app/',
    dist: 'build/',
    build: 'target/',
    clean: ['build/', 'target/']
};

var paths = {
    booklet: ['app/libs/booklet/*.js'],
    libs: [
        'bower_components/react/react.js',
        'bower_components/react/react-dom.js'
    ],
    libcss: [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/font-awesome/css/font-awesome.min.css'
    ],
    libfonts: [
        'bower_components/font-awesome/fonts/**'
    ],
    bookletimages: ['app/libs/booklet/images/**'],
    basefiles: ['package.json'],
    indexhtml: ['index.html'],
    testhtml: ['test.html'],
    reactjs: ['app/js/dist/**'],
    rawjs: ['app/js/*.js'],
    styles: ['app/styles/**']
};

// delete the build directory
gulp.task('clean', function() {
    return gulp.src(bases.clean, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('copy-booklet', ['clean'], function() {
    return gulp.src(paths.booklet, {base: './'})
        .pipe(gulp.dest(bases.dist));
});

gulp.task('copy-files', ['clean'], function() {
    return gulp.src(paths.basefiles)
        .pipe(gulp.dest(bases.dist));
});

gulp.task('copy-libs', ['clean'], function() {
    return gulp.src(paths.libs, {base: './bower_components/'})
        .pipe(gulp.dest(bases.app + "libs"));
});

gulp.task('copy-images', ['clean'], function() {
    return gulp.src(paths.bookletimages)
        .pipe(gulp.dest(bases.app + "styles/css/images"));
});

gulp.task('copy-reactjs', ['clean'], function() {
    return gulp.src(paths.reactjs)
        .pipe(gulp.dest(bases.app + "js"));
});

gulp.task('copy-rawjs', ['clean'], function() {
    return gulp.src(paths.rawjs)
        .pipe(gulp.dest(bases.app + "js"));
});

gulp.task('copy-styles', ['clean'], function() {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(bases.app + 'styles'));
});

gulp.task('copy-libs-css', ['clean'], function() {
    return gulp.src(paths.libcss)
        .pipe(gulp.dest(bases.app + 'styles/css'));
});

gulp.task('copy-libs-fonts', ['clean'], function() {
    return gulp.src(paths.libfonts)
        .pipe(gulp.dest(bases.app + 'styles/fonts'));
});

// replace css/libs/js with min files
gulp.task('build-reactjs', ['clean', 'copy-booklet', 'copy-libs', 'copy-reactjs', 'copy-styles',
    'copy-files', 'copy-images', 'copy-libs-css', 'copy-libs-fonts'],  function() {
    return gulp.src(paths.indexhtml)
        .pipe(htmlreplace({
            'libs': ['app/libs/react/react.js', 'app/libs/react/react-dom.js'],
            'css': ['app/styles/css/bootstrap.min.css', 'app/styles/css/font-awesome.min.css'],
            'js': 'app/js/booker.js'
        }))
        .pipe(gulp.dest(bases.dist));
});

gulp.task('build-rawjs', ['clean', 'copy-booklet', 'copy-rawjs', 'copy-styles', 'copy-files',
    'copy-images', 'copy-libs-css', 'copy-libs-fonts'],  function() {
    return gulp.src(paths.testhtml)
        .pipe(htmlreplace({
            'css': ['app/styles/css/bootstrap.min.css', 'app/styles/css/font-awesome.min.css']
        }))
        .pipe(gulp.dest(bases.dist));
});


// build app 
gulp.task('build-app', ['clean', 'build-reactjs'], function() {
    // before run this task, need to set proxy if your network is behind firewall,
    // and nw don't support proxy currently, but you can set the environment varibles
    // like: HTTP_PROXY=http://proxy.com:port
    var nw = new NwBuilder({
        version: '0.12.3',
        files: './build/**',
        platforms: ['osx32', 'osx64', 'win32', 'win64'],
        buildDir: "./target"
    });

    return nw.build().then(function() {
        console.log("All Done!");
    }).catch(function(err) {
        console.error(err);
    });
});

//build full app
gulp.task('default', ['clean', 'build-app'],  function() {
});
