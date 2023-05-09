var gulp = require('gulp'),
	del = require('del'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifycss = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	gulpsequence = require('gulp-sequence');

	gulp.task('clean', function () {
		return del([
			'www/**/*',
			'www'
		]);
	});

	gulp.task('images', function(){
		return gulp.src('src/img/**/*')
			.pipe(gulp.dest('www/img'))
	});

	gulp.task('files', function(){
		return gulp.src(['src/config.xml', 'src/manifest.json'])
			.pipe(gulp.dest('www/'))
	});

	gulp.task('build', function() {
		return gulp.src("src/index.html")
			.pipe(useref())
			.pipe(gulpif('*.js', uglify()))
			.pipe(gulpif('*.css', minifycss()))
			.pipe(gulp.dest('www/'));
	});

	gulp.task('compress', function() {
		return gulp.src('www/index.html')
			.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
			.pipe(gulp.dest('www/'));
	})

	// gulp.task( 'default', gulpsequence('clean', ['images', 'files', 'build'], 'compress') );
	gulp.task( 'default', gulp.series('clean', gulp.parallel('images', 'files', 'build'), 'compress') );
